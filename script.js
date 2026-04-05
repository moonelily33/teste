const pcData = [
    { member: "JENO", title: "Both Sides Side A Ver.", era: "BOTH SIDES", img: "img/BS0001.png" },
    { member: "JENO", title: "Both Sides Side A Ver.", era: "BOTH SIDES", img: "img/BS0002.png" },
    { member: "JENO", title: "Both Sides Side A Ver.", era: "BOTH SIDES", img: "img/BS0003.png" },
    { member: "JAEMIN", title: "Both Sides Side A Ver.", era: "BOTH SIDES", img: "img/BS0004.png" },
    { member: "JAEMIN", title: "Both Sides Side A Ver.", era: "BOTH SIDES", img: "img/BS0005.png" },
    { member: "JAEMIN", title: "Both Sides Side A Ver.", era: "BOTH SIDES", img: "img/BS0006.png" },
    { member: "JENO", title: "Both Sides Side B Ver.", era: "BOTH SIDES", img: "img/BS0007.png" },
    { member: "JENO", title: "Both Sides Side B Ver.", era: "BOTH SIDES", img: "img/BS0008.png" },
    { member: "JENO", title: "Both Sides Side B Ver.", era: "BOTH SIDES", img: "img/BS0009.png" },
    { member: "JAEMIN", title: "Both Sides Side B Ver.", era: "BOTH SIDES", img: "img/BS0010.png" },
    { member: "JAEMIN", title: "Both Sides Side B Ver.", era: "BOTH SIDES", img: "img/BS0011.png" },
    { member: "JAEMIN", title: "Both Sides Side B Ver.", era: "BOTH SIDES", img: "img/BS0012.png" },
    { member: "UNIT", title: "Both Sides Ver.", era: "BOTH SIDES", img: "img/BS0013.png" },
    { member: "UNIT", title: "Both Sides Ver.", era: "BOTH SIDES", img: "img/BS0014.png" },
    { member: "UNIT", title: "Both Sides Ver.", era: "BOTH SIDES", img: "img/BS0015.png" },
    { member: "UNIT", title: "Both Sides Ver.", era: "BOTH SIDES", img: "img/BS0016.png" },
];

const container = document.getElementById('pc-container');
const searchInput = document.getElementById('searchInput');

function renderPC(data) {
    if (data.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 100px; color: #aaa;">No photocards found.</div>`;
        return;
    }
    container.innerHTML = data.map(pc => `
        <div class="pc-card">
            <img src="${pc.img}" alt="${pc.title}" onerror="this.src='https://via.placeholder.com/150x230?text=MISSING'">
            <div class="pc-info">
                <span class="member-tag">${pc.member}</span>
                <h3 class="benefit-title">${pc.title}</h3>
                <span class="era-tag">${pc.era}</span>
            </div>
        </div>
    `).join('');
}

function filterByMember(member, element) {
    // Sinkronkan UI List Desktop
    const items = document.querySelectorAll('.sidebar-nav li');
    items.forEach(item => item.classList.remove('active'));
    
    if (element) {
        element.classList.add('active');
        document.getElementById('memberSelect').value = member;
    } else {
        // Jika dari dropdown, tandai list yang sesuai
        items.forEach(li => {
            if (li.innerText.toUpperCase().includes(member.toUpperCase())) li.classList.add('active');
        });
    }

    document.getElementById('eraSelect').value = "All"; // Reset Era
    const filtered = (member === 'All') ? pcData : pcData.filter(pc => pc.member === member);
    renderPC(filtered);
}

function filterByEra(era) {
    document.getElementById('memberSelect').value = "All"; // Reset Member
    const filtered = (era === 'All') ? pcData : pcData.filter(pc => pc.era === era);
    renderPC(filtered);
}

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = pcData.filter(pc => 
        pc.member.toLowerCase().includes(term) || 
        pc.title.toLowerCase().includes(term) ||
        pc.era.toLowerCase().includes(term)
    );
    renderPC(filtered);
});

document.addEventListener('DOMContentLoaded', () => renderPC(pcData));
