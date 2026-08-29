export function renderDashboard(target, metrics=[]){target.innerHTML=metrics.map(({label,value})=>`<article class="card"><strong>${value}</strong><span>${label}</span></article>`).join('')}
