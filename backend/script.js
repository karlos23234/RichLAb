let currentUser = null;
const tg = window.Telegram?.WebApp;

function loginWithTelegram() {
    document.getElementById('login-content').classList.add('hidden');
    document.getElementById('login-loading').classList.remove('hidden');

    setTimeout(()=>{
        if(tg?.initDataUnsafe?.user){
            currentUser = {
                id: tg.initDataUnsafe.user.id,
                first_name: tg.initDataUnsafe.user.first_name,
                last_name: tg.initDataUnsafe.user.last_name||'',
                username: tg.initDataUnsafe.user.username||'',
                language_code: tg.initDataUnsafe.user.language_code||'hy'
            };
        } else {
            currentUser={id:123456789, first_name:'Դեմո', last_name:'Օգտատեր', username:'demo_user'};
        }
        localStorage.setItem('richlab_user',JSON.stringify(currentUser));
        completeLogin();
    },500);
}

function checkExistingLogin(){
    const saved = localStorage.getItem('richlab_user');
    if(saved){ currentUser=JSON.parse(saved); completeLogin(); }
}

function completeLogin(){
    document.getElementById('login-screen').style.display='none';
    document.getElementById('dashboard').classList.remove('hidden');
    updateUserInfo();
    generateReferralLink();
    fetchUserData();
}

function updateUserInfo(){ if(currentUser) document.getElementById('user-info').textContent=currentUser.first_name; }

function generateReferralLink(){
    if(currentUser) document.getElementById('referral-link').value=`https://t.me/BirdsGolden_bot/app?startapp=r_${currentUser.id}`;
}

function shareReferralLink(){
    const input=document.getElementById('referral-link');
    if(input && input.value) navigator.clipboard.writeText(input.value).then(()=>alert("Հղումը պատճենվել է")).catch(()=>alert("Չհաջողվեց պատճենել"));
}

// Fetch data from backend
async function fetchUserData(){
    try{
        const res=await fetch(`http://localhost:3000/api/user/${currentUser.id}`);
        const data=await res.json();
        updateDashboard(data);
    }catch(e){console.error(e);}
}

function updateDashboard(data){
    // Referrals
    const list=document.getElementById('referrals-list');
    if(data.referrals.length===0) list.innerHTML='👥 <br>Հաշվետվություններ չկան';
    else list.innerHTML=data.referrals.map(r=>`<div>${r.name}: ${r.earned}֏</div>`).join('');

    // Task progress
    const progress=Math.min(data.tasks.completed/10*100,100);
    document.getElementById('task-progress-bar').style.width=progress+'%';
    document.getElementById('tasks-progress-text').textContent=progress.toFixed(0)+'%';
    document.getElementById('tasks-earnings-text').textContent=data.tasks.earnings+'֏';

    // Total balance
    document.getElementById('total-task-earnings').textContent=data.balance+'֏';
}

checkExistingLogin();
