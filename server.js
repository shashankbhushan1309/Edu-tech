const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Mock database
let projects = [
    {
        id: uuidv4(),
        name: 'Web Development Project',
        description: 'Create a responsive web application',
        status: 'available',
        maxScore: 100,
        deadline: '2024-12-31',
        priority: 'High',
        tasks: [
            { id: uuidv4(), name: 'Frontend Design', weight: 40, completed: false },
            { id: uuidv4(), name: 'Backend Implementation', weight: 30, completed: false },
            { id: uuidv4(), name: 'Database Integration', weight: 30, completed: false }
        ]
    },
    {
        id: uuidv4(),
        name: 'Mobile App Development',
        description: 'Develop a cross-platform mobile application',
        status: 'available',
        maxScore: 100,
        deadline: '2025-01-15',
        priority: 'Medium',
        tasks: [
            { id: uuidv4(), name: 'UI/UX Design', weight: 30, completed: false },
            { id: uuidv4(), name: 'App Functionality', weight: 50, completed: false },
            { id: uuidv4(), name: 'Performance Optimization', weight: 20, completed: false }
        ]
    }
];

let assignedProjects = [];

// Calculate project score based on completed tasks
const calculateScore = (tasks) => {
    return tasks.reduce((total, task) => 
        task.completed ? total + task.weight : total, 0
    );
};

// Fetch available projects
app.get('/projects', (req, res) => {
    const availableProjects = projects.filter(p => p.status === 'available');
    res.json(availableProjects);
});

// Accept a project
app.post('/projects/accept', (req, res) => {
    const { projectId, candidateId } = req.body;
    const project = projects.find(p => p.id === projectId);

    if (!project) {
        return res.status(404).json({ message: 'Project not found.' });
    }

    const existingAssignment = assignedProjects.find(
        p => p.projectId === projectId && p.candidateId === candidateId
    );

    if (existingAssignment) {
        return res.status(400).json({ message: 'Project already assigned to this candidate.' });
    }

    const newAssignedProject = {
        id: uuidv4(),
        projectId,
        name: project.name,
        candidateId,
        maxScore: project.maxScore,
        assignedDate: new Date(),
        completed: false,
        submitted: false, // Locking mechanism
        score: 0,
        tasks: project.tasks.map(task => ({
            id: task.id,
            name: task.name,
            weight: task.weight,
            completed: false
        }))
    };

    assignedProjects.push(newAssignedProject);
    res.json(newAssignedProject);
});

// Update task completion
app.post('/projects/update-task', (req, res) => {
    const { projectId, taskId, completed, candidateId } = req.body;

    const assignedProject = assignedProjects.find(
        p => p.projectId === projectId && p.candidateId === candidateId
    );

    if (!assignedProject) {
        return res.status(404).json({ message: 'Assigned project not found' });
    }

    if (assignedProject.submitted) {
        return res.status(400).json({ message: 'Project has already been submitted and cannot be updated.' });
    }

    const task = assignedProject.tasks.find(t => t.id === taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = completed;
    assignedProject.score = calculateScore(assignedProject.tasks);

    res.json(assignedProject);
});

// Submit project (locks the project upon submission)
app.post('/projects/submit', (req, res) => {
    const { projectId, candidateId } = req.body;

    const assignedProject = assignedProjects.find(
        p => p.projectId === projectId && p.candidateId === candidateId
    );

    if (!assignedProject) {
        return res.status(404).json({ 
            message: 'No matching assigned project found. Please check your project and candidate IDs.' 
        });
    }

    if (assignedProject.submitted) {
        return res.status(400).json({ message: 'Project has already been submitted.' });
    }

    // Calculate score based on completed tasks
    assignedProject.score = calculateScore(assignedProject.tasks);

    // Lock the project
    assignedProject.submitted = true;
    assignedProject.completed = true;

    res.json({ 
        message: 'Project submitted successfully. No further updates allowed.', 
        project: assignedProject 
    });
});

// Fetch assigned projects for a candidate
app.get('/projects/assigned/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;
    const candidateProjects = assignedProjects.filter(p => p.candidateId === candidateId);
    res.json(candidateProjects);
});

// Get candidate rankings (Leaderboard)
app.get('/projects/rankings', (req, res) => {
    const rankings = assignedProjects
        .filter(p => p.submitted) // Include only submitted projects
        .reduce((acc, project) => {
            const candidate = acc.find(r => r.candidateId === project.candidateId);
            if (candidate) {
                candidate.totalScore += project.score;
            } else {
                acc.push({
                    candidateId: project.candidateId,
                    totalScore: project.score
                });
            }
            return acc;
        }, [])
        .sort((a, b) => b.totalScore - a.totalScore); // Sort by total score descending

    res.json(rankings);
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
