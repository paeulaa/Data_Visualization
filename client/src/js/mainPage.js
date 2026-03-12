import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import '../css/mainPage.css';
import { useNavigate } from 'react-router-dom';

function MainPage({ hierarchyData, selectedDegree, selectedMajor, selectedGender }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (hierarchyData) {
            // 筛选数据
            const filteredData = hierarchyData.children.map(cluster => {
                return {
                    ...cluster,
                    children: cluster.children.filter(dataPoint =>
                        (selectedDegree === 'All' || dataPoint.degree === selectedDegree) &&
                        (selectedMajor === 'All' || dataPoint.major === selectedMajor) &&
                        (selectedGender === 'All' || dataPoint.gender === selectedGender)
                    )
                };
            }).filter(cluster => cluster.children.length > 0);

            // 清空原有的 SVG 以便重新绘制
            d3.select("#chart").selectAll("*").remove();

            drawChart({ children: filteredData });
        }
    }, [selectedDegree, selectedMajor, selectedGender, hierarchyData]);

    const drawChart = (data) => {
        d3.select("#chart").selectAll("*").remove();

        if (!data || !data.children) return;

        // 定義動畫函數
        function animatePulse(selection, baseRadius) {
            (function repeat() {
                selection
                    .transition()
                    .duration(2000)
                    .attr("r", baseRadius * 3)
                    .style("opacity", 0.2)
                    .transition()
                    .duration(2000)
                    .attr("r", baseRadius * 2)
                    .style("opacity", 0.1)
                    .on("end", repeat);
            })();
        }

        const width = 1800;
        const height = 2500;
        const radiusStep = 25;
        const clustersPerRow = 5;

        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const horizontalSpacing = 350;  // 左右的間距
        const verticalSpacing = 400;    // 上下的間距
        data.children.forEach((clusterData, index) => {
            const offsetX = 150 + (index % clustersPerRow) * horizontalSpacing;
            const offsetY = 200 + Math.floor(index / clustersPerRow) * verticalSpacing;

            // 添加大背景圓
            svg.append("circle")
                .attr("cx", offsetX)
                .attr("cy", offsetY)
                .attr("r", 5 * radiusStep)
                .style("fill", "transparent") // 背景圓是透明的
                .style("cursor", "pointer") // 改變游標顯示
                .on("click", () => {
                    // // 播放音效
                    // const hoverSound = new Audio('/sounds/water.mp3');
                    // hoverSound.loop = false; 
                    // hoverSound.volume = 1;  
                    // hoverSound.play();

                    // // 設置音效播放時間，然後進行淡出
                    // setTimeout(() => {
                    //     const fadeOutInterval = setInterval(() => {
                    //         if (hoverSound.volume > 0.05) {
                    //             hoverSound.volume -= 0.08;  // 每次降低音量
                    //         } else {
                    //             hoverSound.volume = 0;  // 音量設為 0
                    //             hoverSound.pause();  // 暫停音效
                    //             hoverSound.currentTime = 0;  // 重置播放位置
                    //             clearInterval(fadeOutInterval);  // 清除定時器
                    //         }
                    //     }, 100);  // 每 100 毫秒調整一次音量
                    // }, 500);  // 2 秒後開始淡出
                    // // 點擊整個集群的背景同心圓時，導航至詳細頁面
                    navigate(`/details/${clusterData.name}`);
                }).on("mouseover", function () {
                    createWaveEffect(offsetX, offsetY);
                })
                .on("mouseout", function () {
                    d3.select("#wave-group").remove();
                });

            // 繪製每個集群的同心圓
            for (let i = 1; i <= 5; i++) {
                svg.append("circle")
                    .attr("cx", offsetX)
                    .attr("cy", offsetY)
                    .attr("r", i * radiusStep)
                    .style("fill", "none")
                    .style("stroke", "lightgray")
                    .style("stroke-dasharray", "4,4")
                    .style("opacity", 0)  // initial opacity is 0
                    .transition()         // transition
                    .duration(1200)       // animation duration
                    .ease(d3.easeElastic) // elastic effect
                    .style("opacity", 1); // final opacity;
            }

            // 繪製每個數據點
            clusterData.children.forEach((dataPoint, pointIndex) => {
                const totalPoints = clusterData.children.length;
                const angle = (pointIndex / totalPoints) * 2 * Math.PI * 5;
                const angleOffset = Math.PI / 10;

                const radius = dataPoint.value * radiusStep;
                const finalAngle = angle + angleOffset * pointIndex;

                const x = offsetX + radius * Math.cos(finalAngle);
                const y = offsetY + radius * Math.sin(finalAngle);

                // 繪製光暈效果（脈動動畫）
                svg.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", dataPoint.distance * 3)
                    .style("fill", "lightblue")
                    .style("opacity", 0.1)
                    .call(selection => animatePulse(selection, dataPoint.distance));


                // 數據點
                const circle = svg.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", 0)
                    .style("fill", "DodgerBlue")
                    .on("mouseover", function (event) {
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

                circle.transition()
                    .duration(800)
                    .attr("r", 2.5);
            });

            // Water ripple effect function
            function createWaveEffect(cx, cy) {
                const waveGroup = svg.append("g")
                    .attr("id", "wave-group");

                function repeat() {
                    const wave = waveGroup.append("circle")
                        .attr("cx", cx)
                        .attr("cy", cy)
                        .attr("r", 3)  // 初始半徑
                        .style("fill", "none")
                        .style("stroke", "DodgerBlue")
                        .style("stroke-width", 1)
                        .style("opacity", 0.6);

                    wave.transition()
                        .duration(2000)  // 水波擴展的持續時間
                        .ease(d3.easeCubicOut)
                        .attr("r", 8 * radiusStep)  // 最終半徑與最外圈相同
                        .style("opacity", 0)  // 最終透明度變為 0
                        .on("end", function () {
                            wave.remove();  // 完成後移除水波效果
                            setTimeout(repeat, 500);  // 延遲 500 毫秒後再開始下一次水波效果
                        });
                }

                repeat();
            }

            // 添加標籤
            svg.append("text")
                .attr("x", offsetX)
                .attr("y", offsetY + 5 * radiusStep + 40)
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("font-weight", "regular")
                .text(clusterData.name);
        });
    };

    return (
        <div className="style">
            {/* <h1>Students Data Visualization</h1> */}
            <div id="chart"></div>

            {/* Tooltip */}
            <div id="tooltip" className="hidden">
                <p><span id="value"></span></p>
            </div>
        </div>
    );

}

export default MainPage;