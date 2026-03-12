// ClusterDetails.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import '../css/clusterDetail.css';

function ClusterDetails({ hierarchyData, selectedDegree, selectedMajor, selectedGender }) {
    const { clusterName } = useParams();
    console.log('Selected Cluster Name:', clusterName);

    useEffect(() => {
        console.log('Hierarchy Data:', hierarchyData);
        if (hierarchyData) {
            const chartElement = document.getElementById('cluster-chart');
            if (chartElement) {
                // 查找對應的數據
                const clusterData = hierarchyData.children.find(
                    cluster => cluster.name === clusterName
                );

                if (clusterData) {
                    const filteredClusterData = {
                        ...clusterData,
                        children: clusterData.children.filter(dataPoint =>
                            (selectedDegree === 'All' || dataPoint.degree === selectedDegree) &&
                            (selectedMajor === 'All' || dataPoint.major === selectedMajor) &&
                            (selectedGender === 'All' || dataPoint.gender === selectedGender)
                        )
                    };

                    // 清空原有的 SVG 以便重新繪製
                    d3.select("#cluster-chart").selectAll("*").remove();

                    // 使用過濾後的數據重新繪製圖表
                    drawClusterChart(filteredClusterData);
                } else {
                    console.log('Cluster Data Not Found');
                }
            }
        }
    }, [hierarchyData, clusterName, selectedDegree, selectedMajor, selectedGender]);


    const drawClusterChart = (clusterData) => {
        // 清空之前的圖形，避免重複
        d3.select("#cluster-chart").selectAll("*").remove();

        console.log('Drawing Chart for:', clusterData);

        if (!clusterData) return;
        const chartContainer = document.getElementById('cluster-chart');
        const containerWidth = chartContainer?.clientWidth || window.innerWidth || 1200;
        const isMobile = containerWidth < 768;

        // d3.js 繪圖
        const width = Math.max(containerWidth, 360);
        const height = isMobile ? 760 : 1000;
        const radiusStep = isMobile ? 48 : 70;

        const svg = d3.select("#cluster-chart")
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMin meet")
            .style("width", "100%")
            .style("height", "auto");

        const paddingX = isMobile ? 0 : 120;
        const paddingY = isMobile ? 10 : 70;
        // 計算中心位置
        const offsetX = width / 2 - paddingX;
        const offsetY = height / 2 - paddingY;

        // 繪製同心圓
        for (let i = 1; i <= 5; i++) {
            svg.append("circle")
                .attr("cx", offsetX)
                .attr("cy", offsetY)
                .attr("r", i * radiusStep)
                .style("fill", "none")
                .style("stroke", "lightgray")
                .style("stroke", "4,4");

        }

        // 刻度
        const labels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
        for (let i = 1; i <= 5; i++) {
            // 水平線
            svg.append("line")
                .attr("x1", offsetX + i * radiusStep)
                .attr("y1", offsetY)
                .attr("x2", offsetX + i * radiusStep)
                .attr("y2", offsetY + 10)
                .style("stroke", "gray")
                .style("stroke-width", 1);

            svg.append("line")
                .attr("x1", offsetX + radiusStep)
                .attr("y1", offsetY)
                .attr("x2", offsetX + i * radiusStep)
                .attr("y2", offsetY)
                .style("stroke", "gray")
                .style("stroke-width", 1);

            // 文字標籤 
            const textOffset = 10;  // 控制文字離刻度線的距離
            const labelLines = labels[i - 1].split(' '); // 拆分標籤成多行
            // 右側標籤
            const rightLabel = svg.append("text")
                .attr("x", offsetX + i * radiusStep + textOffset) // 向右偏移
                .attr("y", offsetY + 30)
                .attr("text-anchor", "start")
                .style("font-size", "12px")
                .style("fill", "#696969");

            // 使用 <tspan> 使文字換行
            labelLines.forEach((line, lineIndex) => {
                rightLabel.append("tspan")
                    .attr("x", offsetX + i * radiusStep + textOffset)
                    .attr("dy", lineIndex === 0 ? 0 : 15)
                    .text(line);
            });

        }

        // 繪製數據點
        clusterData.children.forEach((dataPoint, pointIndex) => {
            const totalPoints = clusterData.children.length;
            //const angle = (pointIndex / totalPoints) * 2 * Math.PI;
            const initialAngle = (pointIndex / totalPoints) * 2 * Math.PI;  // 初始角度
            const radius = dataPoint.value * radiusStep;

            // const x = offsetX + radius * Math.cos(angle);
            // const y = offsetY + radius * Math.sin(angle);
            const x = offsetX + radius * Math.cos(initialAngle);
            const y = offsetY + radius * Math.sin(initialAngle);

            // 數據點動態-隨機選擇方向 (1 表示順時針，-1 表示逆時針)
            const direction = Math.random() < 0.5 ? 1 : -1;

            const glow = svg.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", dataPoint.distance * 5)
                .style("fill", "lightblue")
                .style("opacity", 0.2)

            const node = svg.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 4.5)
                .style("fill", "DodgerBlue").on("mouseover", function (event) {
                    d3.select("#tooltip")
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 10) + "px")
                        .select("#value")
                        .html(`
                            <strong>Student ID:</strong> ${dataPoint.studentID}<br>
                            <strong>Degree:</strong> ${dataPoint.degree}<br>
                            <strong>Major:</strong> ${dataPoint.major}<br>
                            <strong>Gender:</strong> ${dataPoint.gender}
                        `);

                    d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseout", function () {
                    d3.select("#tooltip").classed("hidden", true);
                });

            // 繞圓周動畫
            function animateNode(circle, initialAngle) {
                circle.transition()
                    .duration(32000) // 持續時間
                    .ease(d3.easeLinear)
                    .attrTween("cx", function () {
                        return function (t) {
                            const angle = initialAngle + direction * t * 2 * Math.PI;
                            return offsetX + radius * Math.cos(angle);
                        };
                    })
                    .attrTween("cy", function () {
                        return function (t) {
                            const angle = initialAngle + direction * t * 2 * Math.PI;
                            return offsetY + radius * Math.sin(angle);
                        };
                    })
                    .on("end", function () {
                        // 重複動畫
                        animateNode(circle, initialAngle);
                    });
            }

            // 啟動節點和光暈的圓周運動動畫
            animateNode(glow, initialAngle);
            animateNode(node, initialAngle);
        });

    }

    return (
        <div className="canvas">
            <div id="cluster-chart"></div>
            {/* Tooltip */}
            <div id="tooltip" className="hidden">
                <p><span id="value"></span></p>
            </div>
            {/* Background music for ClusterDetails */}
            <audio id="background-audio" src="/sounds/water.mp3" autoPlay loop />
        </div>
    );
}

export default ClusterDetails;
