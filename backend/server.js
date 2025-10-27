const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let users = {}; // { userId: { balance, tasks:{completed, earnings}, referrals:[] } }

app.get('/api/user/:userId', (req,res)=>{
    const id = req.params.userId;
    if(!users[id]) users[id]={ balance:14600, tasks:{completed:2, earnings:5800}, referrals:[] };
    res.json(users[id]);
});

app.post('/api/addReferral',(req,res)=>{
    const {userId,name,earnings}=req.body;
    if(!users[userId]) users[userId]={ balance:0, tasks:{completed:0, earnings:0}, referrals:[] };
    users[userId].referrals.push({name,earned:earnings});
    users[userId].balance += earnings;
    res.json({status:'ok'});
});

app.post('/api/addTask',(req,res)=>{
    const {userId,earnings}=req.body;
    if(!users[userId]) users[userId]={ balance:0, tasks:{completed:0, earnings:0}, referrals:[] };
    users[userId].tasks.completed +=1;
    users[userId].tasks.earnings += earnings;
    users[userId].balance += earnings;
    res.json({status:'ok'});
});

app.listen(3000,()=>console.log('Backend running on port 3000'));
