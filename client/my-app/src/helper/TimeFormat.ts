export default function formatTime(time:string){
   const date=new Date(time)
   let suffix;
   const hh=String(date.getHours()).padStart(2,'0')
   const mm=String(date.getMinutes()).padStart(2,'0')
   if(Number(hh)>0&&Number(hh)<12) suffix='AM'
   else suffix='PM'
   return `${hh}:${mm} ${suffix}`
}