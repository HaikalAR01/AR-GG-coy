// ElectroAR Lab — deliberately scoped single-loop DC teaching solver.
export const forwardVoltage={red:2,green:2.2,blue:3,yellow:2.1};
export function solveCircuit(components,wires,running=true){
 const active=components.filter(c=>['battery','resistor','led','switch'].includes(c.type));
 const groups=Object.fromEntries(['battery','resistor','led','switch'].map(t=>[t,active.filter(c=>c.type===t)]));
 const parent=new Map(active.flatMap(c=>[`${c.id}:0`,`${c.id}:1`]).map(k=>[k,k]));
 const root=k=>{if(!parent.has(k))return null;while(parent.get(k)!==k)k=parent.get(k);return k};
 const union=(a,b)=>{a=root(a);b=root(b);if(a!==null&&b!==null&&a!==b)parent.set(a,b)};
 wires.forEach(w=>union(`${w.a.id}:${w.a.index}`,`${w.b.id}:${w.b.index}`));
 const [b,r,l,s]=['battery','resistor','led','switch'].map(t=>groups[t][0]);
 let status='Tambahkan baterai, resistor, LED dan saklar.',short=false,valid=false,unsafe=false,current=0,power=0;
 const voltage=b?.value||0;
 if(b){short=root(`${b.id}:0`)===root(`${b.id}:1`);if(short)status='BAHAYA: terminal baterai terhubung langsung (korsleting).';
 else if(Object.values(groups).some(g=>g.length!==1))status='Solver pembelajaran hanya mendukung tepat satu baterai, resistor, LED, dan saklar dalam satu loop seri.';
 else if(!s.closed)status='Saklar terbuka: tidak ada arus.';
 else {
 // Polarity convention: terminal 0 of battery is positive; terminal 0 of LED is anode.
 const path=[[b.id,0],[s.id,0],[s.id,1],[r.id,0],[r.id,1],[l.id,0],[l.id,1],[b.id,1]];
 valid=[[0,1],[2,3],[4,5],[6,7]].every(([i,j])=>root(path[i].join(':'))===root(path[j].join(':')));
 if(!valid)status='Rangkaian terbuka, urutan kabel tidak sesuai, atau polaritas LED terbalik.';
 else if(voltage<=forwardVoltage[l.color])status='Tegangan tidak cukup untuk bias maju LED.';
 else{current=1000*(voltage-forwardVoltage[l.color])/Math.max(.1,r.value);power=current*current*r.value/1000;unsafe=current>20;status=unsafe?'PERINGATAN: arus LED di atas 20 mA; perbesar resistor.':'Rangkaian seri berfungsi; LED menyala.';}
 }}
 if(!running){current=0;power=0;status='Simulasi berhenti. '+status}
 return {voltage,current,power,valid:running&&valid&&!short,short,unsafe,status,resistor:r?.value||0,led:l?.color||'red',forward: l?forwardVoltage[l.color]:0, switchClosed:!!s?.closed};
}
