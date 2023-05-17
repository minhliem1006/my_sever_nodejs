const mongoose = require("mongoose");
const conn = mongoose.createConnection('mongodb+srv://liem_new_project:liem112233@cluster0.ggfsjxl.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

conn.on('connected',function(){
    console.log(`mongodb:::connected:::${this.name}`);
});

conn.on('disconnected',function(){
  console.log(`mongodb:::disconnected:::${this.name}`);
});

conn.on('error',function(error){
  console.log(`mongodb:: error:::${JSON.stringify(error)}`);
})

process.on('SIGINT',async ()=>{ 
  await conn.close();
  process.exit(0);
});

module.exports = conn