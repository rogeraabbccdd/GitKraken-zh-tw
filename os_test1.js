const { exec } = require('child_process');
let h
async function df(){
  let gs = await exec('gitkraken -v', (error, stdout, stderr) => {
    return stdout
  })
  let values  = await Promise.all([gs])
  console.log(values);
}
df()
console.log(df().then((values)=>{console.log(values);}))
// console.log(typeof(h));
