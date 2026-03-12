## The Learning Ripple Effect of Chatbots

The visualization is built with **React**, **D3.js**, **Python3**, and **SQLite**, combining full-stack data processing with an interactive frontend. The ripple pattern visually represents how students' engagement with AI grows and changes across different learning contexts.

***

### Behind the Scenes

#### 1. Dataset
Survey data from 131 students on their use of generative AI in learning.
<br>
<br>
<img src="images/questions.png?raw=true"/>

#### 2. Data Processing
Raw text data was processed into hierarchical JSON with Python & SQLite, mapping agreement and frequency levels numerically.
<br>
<br>
**Step 1: Mapping responses** <br>
Survey answers were converted from text to numeric values for visualization and analysis.
<br>
- Agreement Mapping: <br>"Strongly Disagree" -> 1, ..., "Strongly Agree" -> 5
- Frequency Mapping: "Never" -> 1, ..., "Very Often" -> 5
<br>

**Step 2: Data Structuring** <br>
Mapped data was stored in a hierarchical JSON format, including values such as agreement level, usage frequency, student ID, degree, major, and gender.
<br>
```
"name": "Q5.1",
          "children": [{
                  "name": "Data Point 1", "value": 4, "distance": 4.0,
                  "studentID": "0",  "degree": "Master",
                  "major": "International_Economic_Relations",
                  "gender": "Female" }, ...
```

#### 3. Visualization
D3.js was used to draw the concentric circles, animate nodes, and handle interactions.
<br>
<br>
<img src="images/d3-intro-1.png?raw=true"/>

***

### How It Works

<img src="images/note-1.png?raw=true"/>
<br>
- **Ripple Design**: Concentric circles represent levels of agreement (from "Strongly Disagree" to "Strongly Agree")
- **Red Dots**: Each dot = a student response
- **Glow Effects**: The glow size = how frequently the student uses AI tools ("Never" -> "Very Often")
- **Interactions**: Hovering reveals student details (degree, major, gender), and creates a ripple animation


***

### Wrap-up
The final visualization presents student responses as ripple-like concentric circles, where each dot reflects individual engagement levels and AI usage frequency. Users can explore each question, interact with the data through hover, and intuitively observe how AI adoption spreads across the learning experience.
<br>
<br>
<img src="images/ripple-g.gif?raw=true"/>

***
<p style="font-size:11px">copyright © juichien - all rights reserved</p>
