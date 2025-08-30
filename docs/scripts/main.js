// ========== Utility ==========
function $(id){return document.getElementById(id);}
let materials=[], chart;
const LS_KEY='buildy_v5_materials';

// ========== Load/Save ==========
function load(){const s=localStorage.getItem(LS_KEY); if(s) materials=JSON.parse(s);}
function save(){localStorage.setItem(LS_KEY,JSON.stringify(materials));}

// ========== Toast ==========
function showToast(msg){
    const t=$('toast');
    t.textContent=msg;
    t.style.opacity=1;
    setTimeout(()=>t.style.opacity=0,3000);
}

// ========== Elements ==========
const materialInput=$('materialInput'),supplierInput=$('supplierInput'),unitInput=$('unitInput'),
quantityInput=$('quantityInput'),priceInput=$('priceInput'),vatInput=$('vatInput'),deliveryInput=$('deliveryInput');
const addBtn=$('addBtn'),filterMaterial=$('filterMaterial'),filterSupplier=$('filterSupplier'),
exportExcelBtn=$('exportExcelBtn'),downloadJsonBtn=$('downloadJsonBtn'),
uploadJsonInput=$('uploadJsonInput'),clearAllBtn=$('clearAllBtn'),darkToggle=$('darkToggle');

// ========== Initialize ==========
load();
refreshAll();

// ========== Dark Mode ==========
darkToggle.addEventListener('click',()=>{
    document.body.classList.toggle('dark');
    darkToggle.textContent=document.body.classList.contains('dark')?'☀️':'🌙';
    renderMainChart();
});

// ========== Add/Update Material ==========
addBtn.addEventListener('click',()=>{
    const name=materialInput.value.trim(),
          sup=supplierInput.value.trim(),
          unit=unitInput.value.trim();
    const quantity=parseFloat(quantityInput.value),
          price=parseFloat(priceInput.value),
          vat=parseFloat(vatInput.value)||0,
          delivery=parseFloat(deliveryInput.value)||0;

    if(!name||!sup||!unit||isNaN(quantity)||isNaN(price)){
        alert('Fill required fields'); return;
    }

    let mat=materials.find(m=>m.name.toLowerCase()===name.toLowerCase());
    if(!mat){mat={name,prices:[],history:[]}; materials.push(mat);}
    const existing=mat.prices.find(p=>p.supplier.toLowerCase()===sup.toLowerCase()&&p.unit===unit);
    const today=new Date().toISOString().split('T')[0];

    if(existing){
        existing.price=price; existing.quantity=quantity; existing.vat=vat; existing.delivery=delivery;
    } else {
        mat.prices.push({supplier:sup,unit,price,quantity,vat,delivery});
    }

    mat.history.push({supplier:sup,unit,price,quantity,vat,delivery,date:today});

    showToast(`${sup} updated for ${name}`);
    materialInput.value=supplierInput.value=unitInput.value=quantityInput.value=priceInput.value=vatInput.value=deliveryInput.value='';
    refreshAll();
});

// ========== Filters ==========
filterMaterial.addEventListener('input',()=>{setTimeout(refreshAll,150);});
filterSupplier.addEventListener('change',refreshAll);

// ========== Export Excel ==========
exportExcelBtn.addEventListener('click',()=>{
    const wb=XLSX.utils.book_new(); 
    const ws_data=[["Material","Supplier","Unit","Quantity","Price (€)","VAT %","Delivery (€)","Total (€)"]];
    materials.forEach(m=>{
        m.prices.forEach(p=>{
            const total=(p.price*p.quantity)+p.delivery+(p.price*p.quantity*p.vat/100);
            ws_data.push([m.name,p.supplier,p.unit,p.quantity,p.price,p.vat,p.delivery,total]);
        });
    });
    const ws=XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb,ws,"Prices");
    XLSX.writeFile(wb,"Buildy_Prices.xlsx");
});

// ========== JSON Save/Load ==========
downloadJsonBtn.addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify(materials,null,2)],{type:'application/json'});
    const a=document.createElement('a'); 
    a.href=URL.createObjectURL(blob); 
    a.download='buildy_data.json'; 
    a.click(); 
    URL.revokeObjectURL(a.href);
});
uploadJsonInput.addEventListener('change',async(e)=>{
    const f=e.target.files[0]; if(!f)return;
    try{
        const t=await f.text();
        const p=JSON.parse(t); if(!Array.isArray(p)) throw 'Invalid';
        materials=p; 
        refreshAll(); 
        showToast('JSON Imported');
    }catch(err){alert('Invalid JSON');}
});
clearAllBtn.addEventListener('click',()=>{
    if(confirm('Clear all data?')){
        materials=[]; 
        refreshAll(); 
        showToast('All cleared');
    }
});

// ========== Refresh Table & Charts ==========
function refreshAll(){
    save(); 
    renderFilterOptions(); 
    renderTable(); 
    renderMainChart();
}

// ========== Filter Options ==========
function renderFilterOptions(){
    const suppliers=new Set();
    materials.forEach(m=>m.prices.forEach(p=>suppliers.add(p.supplier)));
    filterSupplier.innerHTML='<option value="">All Suppliers</option>';
    Array.from(suppliers).sort().forEach(s=>{
        const o=document.createElement('option'); 
        o.value=s; o.textContent=s; 
        filterSupplier.appendChild(o);
    });
}

// ========== Price Trend Detection ==========
function getPriceTrend(history){
    if(history.length < 2) return "stable";
    const last=history[history.length-1].price;
    const prev=history[history.length-2].price;
    if(last < prev) return "down";
    if(last > prev) return "up";
    return "stable";
}

// ========== Render Table ==========
function renderTable(){
    const tbody=$('priceTable').querySelector('tbody');
    tbody.innerHTML='';
    const headerTr=document.getElementById('tableHeader');
    headerTr.innerHTML='';
    ['Material','Supplier','Unit','Qty','Price (€)','VAT %','Delivery (€)','Total (€)','Trend','History']
    .forEach(h=>{
        const th=document.createElement('th'); 
        th.textContent=h; 
        headerTr.appendChild(th);
    });

    const filterMat=filterMaterial.value.toLowerCase();
    const filterSup=filterSupplier.value;

    materials.forEach(m=>{
        if(filterMat && !m.name.toLowerCase().includes(filterMat)) return;

        m.prices.forEach(p=>{
            if(filterSup && p.supplier!==filterSup) return;

            const tr=document.createElement('tr');
            const total=(p.price*p.quantity)+p.delivery+(p.price*p.quantity*p.vat/100);

            // Cheapest/Expensive highlight
            const totals=m.prices.map(pp=>(pp.price*pp.quantity)+pp.delivery+(pp.price*pp.quantity*pp.vat/100));
            const minTotal=Math.min(...totals);
            const maxTotal=Math.max(...totals);

            const tdMaker=(val,cls)=>{const td=document.createElement('td'); td.textContent=val; if(cls)td.className=cls; return td;};

            tr.appendChild(tdMaker(m.name));
            tr.appendChild(tdMaker(p.supplier));
            tr.appendChild(tdMaker(p.unit));
            tr.appendChild(tdMaker(p.quantity));
            tr.appendChild(tdMaker(p.price));
            tr.appendChild(tdMaker(p.vat));
            tr.appendChild(tdMaker(p.delivery));

            let cls='medium';
            if(total===minTotal) cls='cheapest';
            else if(total===maxTotal) cls='expensive';
            tr.appendChild(tdMaker(total.toFixed(2),cls));

            // ===== NEW: Trend Badge =====
            const tdTrend=document.createElement('td');
            const trend=getPriceTrend(m.history.filter(h=>h.supplier===p.supplier));
            let badge=document.createElement('span');
            badge.className='badge';
            if(trend==="down"){badge.classList.add('badge-down'); badge.textContent="Cheaper";}
            else if(trend==="up"){badge.classList.add('badge-up'); badge.textContent="Rising";}
            else {badge.classList.add('badge-stable'); badge.textContent="Stable";}
            tdTrend.appendChild(badge);
            tr.appendChild(tdTrend);

            // Mini chart
            const tdChart=document.createElement('td');
            const canvas=document.createElement('canvas'); canvas.className='canvas-mini';
            tdChart.appendChild(canvas); tr.appendChild(tdChart);

            tbody.appendChild(tr);
            renderMiniChart(m, p.supplier, canvas);
        });
    });
}

// ========== Render Mini Historical Chart ==========
function renderMiniChart(material, supplier, canvas){
    const data=material.history.filter(h=>h.supplier===supplier).map(h=>({x:h.date, y:h.price}));
    new Chart(canvas,{
        type:'line',
        data:{datasets:[{label:supplier,data:data,borderColor:'#4b0082',backgroundColor:'rgba(75,0,130,0.2)',fill:true,tension:0.3}]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}}}
    });
}

// ========== Render Main Chart ==========
function renderMainChart(){
    if(chart) chart.destroy();
    const labels=materials.map(m=>m.name);
    const datasets=[];
    const colors=['#4b0082','#6a0dad','#a67bf0','#8d5bd6','#c299ff'];
    let colorIndex=0;
    const filterSup=filterSupplier.value;

    materials.forEach(m=>{
        m.prices.forEach(p=>{
            if(filterSup && p.supplier!==filterSup) return;
            const total=(p.price*p.quantity)+p.delivery+(p.price*p.quantity*p.vat/100);
            datasets.push({
                label:`${p.supplier} (${m.name})`,
                data:[total],
                backgroundColor:colors[colorIndex%colors.length],
                borderColor:colors[colorIndex%colors.length]
            });
            colorIndex++;
        });
    });

    const ctx=$('priceChart').getContext('2d');
    chart=new Chart(ctx,{
        type:'bar',
        data:{labels:['Total per Material'],datasets:datasets},
        options:{responsive:true,plugins:{legend:{position:'bottom'}},scales:{y:{beginAtZero:true}}}
    });
}
