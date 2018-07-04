prevCommands:function(field){
  if(this.upKeyCount>0 && this.upKeyCount-1>=0) {
    this.upKeyCount=this.upKeyCount-1 
    if(this.getHistoricalData.length>0)
    field.commandInput=this.getHistoricalData[this.upKeyCount]
    else
    field.commandInput=this.fields[this.upKeyCount].commandInput
    this.downKeyCount=this.upKeyCount
  }
  if(this.upKeyCount==0)
  {
    this.downKeyCount=this.upKeyCount
    return false
  }
}
nextCommands:function(field){
this.downKeyCount=this.downKeyCount+1
if(this.downKeyCount>this.commandLength-1)
  field.commandInput=''
else{
  if(this.getHistoricalData.length>0)
    field.commandInput=this.getHistoricalData[this.downKeyCount]
  else
    field.commandInput=this.fields[this.upKeyCount].commandInput
}
this.upKeyCount=this.downKeyCount
}