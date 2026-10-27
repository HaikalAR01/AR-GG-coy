// ElectroAR Lab V3.1: topology-aware DC SERIES solver.
// Supports arbitrary component order, multiple resistors/LEDs/switches in one loop.
// Parallel/branched circuits intentionally rejected (never fabricated readings).
export const forwardVoltage={red:2,green:2.2,blue:3,yellow:2.1,white:3.1};
export function solveCircuit(components,wires,running=true){
 const supported=components.filter(c=>['battery','resistor','led','switch'].includes(c.type));
 const batteries=supported.filter(c=>c.type==='battery');
 const leds=supported.filter(c=>c.type==='led');
 const resistors=supported.filter(c=>c.type==='resistor');
 const firstLed=leds[0];
 const battery=batteries[0];
 const result={voltage:battery?.value||0,current:0,power:0,valid:false,short:false,unsafe:false,status:'',resistor:resistors[0]?.value||0,led:firstLed?.color||'red',forward:firstLed?forwardVoltage[firstLed.color]??2:0,switchClosed:supported.filter(c=>c.type==='switch').every(c=>c.closed),componentCurrents:{},componentVoltages:{}};
 const finish=msg=>({...result,status:running?msg:'Simulasi berhenti. '+msg});
 if(!running)return finish('Tidak ada arus saat simulasi dihentikan.');
 if(batteries.length!==1)return finish('Tambahkan tepat satu baterai untuk simulasi DC seri.');
 if(!Number.isFinite(battery.value)||battery.value<=0)return finish('Tegangan baterai harus positif.');
 if(!resistors.length)return finish('Tambahkan resistor pembatas arus sebelum menjalankan rangkaian.');
 if(!leds.length)return finish('Tambahkan LED untuk percobaan ini.');
 if(supported.some(c=>c.type==='resistor'&&(!Number.isFinite(c.value)||c.value<=0)))return finish('Nilai resistor harus lebih besar dari 0 Ω.');
 const ids=new Set(supported.map(c=>c.id));
 const parent=new Map(supported.flatMap(c=>[`${c.id}:0`,`${c.id}:1`]).map(k=>[k,k]));
 function root(k){if(!parent.has(k))return null;while(parent.get(k)!==k){parent.set(k,parent.get(parent.get(k)));k=parent.get(k)}return k}
 function union(a,b){a=root(a);b=root(b);if(a!==null&&b!==null&&a!==b)parent.set(a,b)}
 for(const w of wires){if(ids.has(w.a?.id)&&ids.has(w.b?.id)&&[0,1].includes(w.a.index)&&[0,1].includes(w.b.index))union(`${w.a.id}:${w.a.index}`,`${w.b.id}:${w.b.index}`)}
 const plus=root(`${battery.id}:0`),minus=root(`${battery.id}:1`);
 if(plus===minus){result.short=true;return finish('BAHAYA: terminal baterai terhubung langsung oleh kabel (korsleting).')}
 // Each two-terminal component becomes an edge between wire-equivalent nodes.
 const adjacency=new Map();
 for(const c of supported){const a=root(`${c.id}:0`),b=root(`${c.id}:1`);if(a===b&&c.type!=='battery'){return finish(`Komponen #${c.id} dibypass oleh kabel. Perbaiki sambungan.`)}for(const [n,side] of [[a,0],[b,1]]){if(!adjacency.has(n))adjacency.set(n,[]);adjacency.get(n).push({c,side})}}
 // A valid single series loop has degree exactly 2 at every connected node.
 if([...adjacency.values()].some(edges=>edges.length!==2))return finish('Rangkaian terbuka atau bercabang. Solver saat ini hanya mendukung satu loop seri.');
 const path=[];let node=plus,prev=battery.id;const seen=new Set();
 for(let i=0;i<supported.length;i++){
   const edge=adjacency.get(node)?.find(e=>e.c.id!==prev);
   if(!edge||edge.c.type==='battery'||seen.has(edge.c.id))break;
   seen.add(edge.c.id);path.push({c:edge.c,entry:edge.side});
   prev=edge.c.id;node=root(`${edge.c.id}:${1-edge.side}`);
   if(node===minus)break;
 }
 if(node!==minus||seen.size!==supported.length-1)return finish('Ada komponen terputus atau loop terpisah. Periksa semua sambungan.');
 if(path.some(p=>p.c.type==='switch'&&!p.c.closed))return finish('Saklar terbuka: arus 0 mA.');
 if(path.some(p=>p.c.type==='led'&&p.entry!==0))return finish('Polaritas LED terbalik: anoda harus menuju sisi positif sumber.');
 const R=resistors.reduce((s,c)=>s+c.value,0);
 const Vled=leds.reduce((s,c)=>s+(forwardVoltage[c.color]??2),0);
 if(battery.value<=Vled)return finish('Tegangan sumber tidak cukup untuk menyalakan LED.');
 const amps=(battery.value-Vled)/R;
 result.current=amps*1000;result.power=amps*amps*R*1000;result.valid=true;
 for(const c of supported){result.componentCurrents[c.id]=result.current;result.componentVoltages[c.id]=c.type==='resistor'?amps*c.value:c.type==='led'?(forwardVoltage[c.color]??2):c.type==='battery'?battery.value:0}
 result.unsafe=result.current>20||resistors.some(c=>amps*amps*c.value>.25);
 result.status=result.unsafe?'PERINGATAN: arus LED >20 mA atau daya resistor >0,25 W.':'Rangkaian seri berfungsi. Semua LED menyala.';
 return result;
}
