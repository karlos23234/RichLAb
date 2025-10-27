// Telegram Web App API
const tg = window.Telegram.WebApp;
const userId = tg.initDataUnsafe?.user?.id || 12345;
const userName = tg.initDataUnsafe?.user?.first_name || "USER";

// Օգտատիրոջ տվյալներ
const currentUser = { referrals: [], tasks: {completed:0, earnings:0}, balance: 0 };

const referralBonus = 4000;
const referralPercent = 0.10;
const totalTasksTarget = 10;

// Referral link
document.getElementById('referral-link').value = `https://t.me/BirdsGolden_bot/app?startapp=r_${userId}`;
function shareReferralLink() {
    navigator.clipboard.writeText(document.getElementById('referral-link').value)
        .then(() => alert("Հղումը պատճենվել է clipboard-ին"))
        .catch(() => alert("Չհաջողվեց պատճենել հղումը"));
}

// Dashboard update
function updateDashboard() {
    const container = document.getElementById('referrals-list');
    if(currentUser.referrals.length === 0){
        container.innerHTML = `<div class="text-center py-8 text-gray-500">
            <div class="text-4xl mb-2">👥</div>
            <div class="font-medium">Հաշվետվություններ չկան</div>
            <div class="text-sm">Այս պահին ոչ ոք չի գրանցվել Ձեր հղումով:</div>
        </div>`;
    } else {
        container.innerHTML = currentUser.referrals.map(r => `
            <div class="flex justify-between py-2 border-b">
                <span>${r.name}</span>
                <span>${r.earned}֏</span>
            </div>
        `).join('');
    }

    const progressPercent = Math.min((currentUser.tasks.completed / totalTasksTarget)*100,100);
    document.getElementById('task-progress-bar').style.width = progressPercent + '%';
    document.getElementById('tasks-progress-text').textContent = progressPercent.toFixed(0)+'%';
    document.getElementById('tasks-earnings-text').textContent = currentUser.tasks.earnings + '֏';

    document.getElementById('total-task-earnings').textContent = currentUser.balance + '֏';
}

// Fetch user data from API
async function fetchUserData(){
    try{
        const response = await fetch(`https://yourserver.com/api/user/${userId}`);
        const data = await response.json();
        currentUser.referrals = data.referrals;
        currentUser.tasks = data.tasks;
        currentUser.balance = data.balance;
        updateDashboard();
    }catch(err){
        console.error("API error:", err);
    }
}

// Add referral via API
async function addReferralAPI(name, earnings){
    try{
        await fetch(`https://yourserver.com/api/addReferral`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({userId, name, earnings})
        });
        fetchUserData();
    }catch(err){ console.error(err); }
}

// Add task via API
async function addTaskAPI(earnings){
    try{
        await fetch(`https://yourserver.com/api/addTask`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({userId, earnings})
        });
        fetchUserData();
    }catch(err){ console.error(err); }
}

// Initialize
fetchUserData();
