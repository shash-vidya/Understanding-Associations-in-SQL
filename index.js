const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./utils/database');
const User = require('./models/user');
const Post = require('./models/post');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Association
User.hasMany(Post);
Post.belongsTo(User);

// Sync database
sequelize.sync({ force: true }) // Use force: false after first run
    .then(() => console.log('Database synced with associations'))
    .catch(err => console.error(err));

// Routes

// Create User
app.post('/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Get all Users
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({ include: Post });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Create Post for a User
app.post('/users/:userId/posts', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const post = await user.createPost(req.body);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Get Posts for a User
app.get('/users/:userId/posts', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, { include: Post });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user.Posts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

const PORT = 3008;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
