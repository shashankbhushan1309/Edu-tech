let currentCandidateId = null;

// Login function
function login() {
    const candidateId = document.getElementById('candidateId').value;
    if (candidateId.trim()) {
        currentCandidateId = candidateId.trim();
        document.getElementById('login-section').classList.add('hidden');
        fetchAvailableProjects();
        fetchAssignedProjects();
        fetchLeaderboard();
    } else {
        alert('Please enter a valid Candidate ID');
    }
}

// Fetch available projects
async function fetchAvailableProjects() {
    try {
        const response = await fetch('http://localhost:3000/projects');
        if (!response.ok) throw new Error('Failed to fetch available projects.');

        const projects = await response.json();
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '';

        if (projects.length === 0) {
            projectsList.innerHTML = '<p>No projects available currently.</p>';
        } else {
            projects.forEach(project => {
                const projectDiv = document.createElement('div');
                projectDiv.classList.add('project-card');
                projectDiv.innerHTML = `
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <p><strong>Priority:</strong> ${project.priority}</p>
                    <p><strong>Deadline:</strong> ${project.deadline}</p>
                    <button onclick="acceptProject('${project.id}')">Accept Project</button>
                `;
                projectsList.appendChild(projectDiv);
            });
        }
        document.getElementById('available-projects').classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching projects:', error);
        alert('Unable to load available projects.');
    }
}

// Accept project
async function acceptProject(projectId) {
    try {
        const response = await fetch('http://localhost:3000/projects/accept', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId, candidateId: currentCandidateId })
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.message || 'Failed to accept project.');
        } else {
            alert('Project accepted successfully!');
            fetchAvailableProjects();
            fetchAssignedProjects();
        }
    } catch (error) {
        console.error('Error accepting project:', error);
        alert('Unable to accept the project.');
    }
}

// Fetch assigned projects
async function fetchAssignedProjects() {
    try {
        const response = await fetch(`http://localhost:3000/projects/assigned/${currentCandidateId}`);
        if (!response.ok) throw new Error('Failed to fetch assigned projects.');

        const projects = await response.json();
        const assignedProjectsList = document.getElementById('assigned-projects-list');
        assignedProjectsList.innerHTML = '';

        if (projects.length === 0) {
            assignedProjectsList.innerHTML = '<p>No assigned projects yet.</p>';
        } else {
            projects.forEach(project => {
                const projectDiv = document.createElement('div');
                projectDiv.classList.add('project-card');

                const tasksHTML = project.tasks.map(task => `
                    <div class="task">
                        <span class="${task.completed ? 'completed' : ''}">${task.name}</span>
                        <input 
                            type="checkbox" 
                            ${task.completed ? 'checked disabled' : ''} 
                            onchange="updateTaskCompletion('${project.projectId}', '${task.id}', this.checked)"
                        >
                    </div>
                `).join('');

                const isSubmitted = project.completed;

                projectDiv.innerHTML = `
                    <h3>${project.name || 'Project'}</h3>
                    <p><strong>Score:</strong> ${project.score} / ${project.maxScore}</p>
                    <div class="tasks">${tasksHTML}</div>
                    <button 
                        onclick="submitProject('${project.projectId}')"
                        ${isSubmitted ? 'disabled' : ''}
                    >
                        ${isSubmitted ? 'Submitted' : 'Submit Assignment'}
                    </button>
                `;
                assignedProjectsList.appendChild(projectDiv);
            });
        }

        document.getElementById('assigned-projects').classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching assigned projects:', error);
        alert('Unable to load assigned projects.');
    }
}

// Update task completion
async function updateTaskCompletion(projectId, taskId, completed) {
    try {
        const response = await fetch('http://localhost:3000/projects/update-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId, taskId, completed, candidateId: currentCandidateId })
        });

        if (!response.ok) {
            const message = await response.json();
            alert(message.message || 'Failed to update task.');
        } else {
            fetchAssignedProjects();
        }
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Unable to update task.');
    }
}

// Submit project (allows partial completion)
async function submitProject(projectId) {
    try {
        const response = await fetch('http://localhost:3000/projects/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                projectId, 
                candidateId: currentCandidateId 
            })
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.message || 'Failed to submit assignment.');
            return;
        }

        const result = await response.json();
        alert('Assignment submitted successfully!');
        fetchAssignedProjects();
        fetchLeaderboard();
    } catch (error) {
        console.error('Error submitting project:', error);
        alert('Unable to submit the assignment. Please try again.');
    }
}

// Fetch leaderboard
async function fetchLeaderboard() {
    try {
        const response = await fetch('http://localhost:3000/projects/rankings');
        if (!response.ok) throw new Error('Failed to fetch leaderboard.');

        const rankings = await response.json();
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';

        if (rankings.length === 0) {
            leaderboardList.innerHTML = '<p>No leaderboard data available.</p>';
        } else {
            rankings.forEach((ranking, index) => {
                const leaderboardItem = document.createElement('div');
                leaderboardItem.classList.add('leaderboard-item');
                leaderboardItem.innerHTML = `
                    <p><strong>${index + 1}.</strong> Candidate ID: ${ranking.candidateId}</p>
                    <p>Total Score: ${ranking.totalScore}</p>
                `;
                leaderboardList.appendChild(leaderboardItem);
            });
        }

        document.getElementById('leaderboard').classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        alert('Unable to load leaderboard.');
    }
}
