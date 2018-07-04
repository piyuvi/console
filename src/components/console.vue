<template>
 <div class="container">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> 
  <b-tabs pills card>
    <b-tab title="Playground" active>   
  <md-field v-for="(field,index) in fields" :key="index">
    <b-container>
      <b-row>
        <md-icon class="fa fa-angle-right"></md-icon>
        <at-ta :members="matches" :ats="atsFilter" v-model="field.commandInput">
        <md-textarea v-focus="true" @input="change(field.commandInput)" @keydown.enter.prevent class="autogrow" @keyup.ctrl.down="nextCommands(field)" @keyup.ctrl.up="prevCommands(field)"  v-model="field.commandInput" v-on:keyup.enter="onSubmit(field)" md-autogrow :readonly="field.readonly">
        </md-textarea>
        </at-ta>
      </b-row>
      <b-row class="output" v-for="(log,index) in field.commandOutput" :key="index">
        <span v-if="field.showOutput" :class="'label-' + log.style">
           <md-icon v-if="log.style=='danger'" class="fa fa-times-circle"></md-icon>
           <md-icon v-else class="fa fa-angle-left"></md-icon>
          {{log.message}}
        </span>
      </b-row>
    </b-container>
  </md-field>
  </b-tab>
    <b-tab title="Help">
      <b-container>
        <b-row class="help" v-for="(help,index) in showHelp" :key="index">
        {{help}}
      </b-row>
      </b-container>
    </b-tab>
  </b-tabs>
  </div>
</template>

<script>
import AtTa from 'vue-at/dist/vue-at-textarea'
import filterdata from '../data/data.js'
const focus = {
  inserted(el) {
    el.focus()
  },
}
export default {
  name: 'console',
  components: {  AtTa  },
  directives: { focus },
  data () {
    return {
      commandInput:'',
      logs:[],
      fields:[{commandInput:'',readonly:false, showOutput:false, commandOutput:[], callbackFlag:false, afterConsole:''}],
      history:[],
      getHistoricalData:[],
      members: [],
      inputArray:[],
      ats:[],
      space:-1,
      inputField:'',
      inputValue:'',
      autocomplete:'',
      showHelp:[],
      objectInsideArray:false
    }
  },
  computed:{
    atsFilter(){
      if(!this.inputValue.charAt(0))
        return this.ats
      else
        return this.ats.filter((item)=>{
          return item==this.inputValue.charAt(0)
      })
    },
    matches() {
      return this.members.filter((item) => {
        return item.toLowerCase().startsWith(this.inputValue.toLowerCase())?item:''
      })
    },
  },
  methods:{
    onSubmit(field){
      this.upKeyCount=0
      this.downKeyCount=0
      if(field.commandInput.trim() =='') return false;
      field.showOutput=true
      field.readonly=true
      field.showInput=true
      this.logs=[]
      setTimeout(()=>{
      this.fields.push({commandInput:'',readonly:false, showOutput:false,commandOutput:[], afterConsole:''})      
      },1000)
      this.setHistory(this.fields)
      this.execute(field) //carries out the function of pushing log messages
    },
    execute(field){
      field.commandOutput=[]
      if(field.commandInput.trim()==':history')
        this.printHistory(field)
      else{
        try{
        this.logs.push({
          message: (window.eval(field.commandInput) ? eval(field.commandInput) : 'undefined'),
          style: 'primary'
        })
        }
        catch(e){
          this.logs.push({
            message:e.toString(),
            style:'danger'
          })
        }
        this.logs.filter((log)=>{
          field.commandOutput.push({message:log.message,style:log.style})
        })
      }
    },
    consoleLog(...message){
      //to check for an object
      if(typeof(message[0])=='object' && !Array.isArray(message[0]))
      {
        var output='Object { '
        for (let property in message[0]) {
          if(typeof(message[0][property])=='string')
          output += property + ': ' +'"'+ message[0][property]+'"'+'; ';
          else
          output += property + ': ' + message[0][property]+'; ';
        }
        output+=' }'
        message[0]=output
      }
      //to check for a array
      if(Array.isArray(message[0])){
      var tempVal='';
      var storeValue='[ '
      for(let i=0;i<message[0].length;i++)
      { 
        if(typeof(message[0][i])=='object' && !Array.isArray(message[0][i]))//object inside an array
        {
        this.objectInsideArray=true
         tempVal=' { '
        for (var property in message[0][i]) {
          if(typeof(message[0][i][property])=='string')
          tempVal += property + ': ' +'"'+ message[0][i][property]+'"';
          else
          tempVal += property + ': ' + message[0][i][property];
        }
        tempVal+=' } '
        }
        else
        this.objectInsideArray=false
        storeValue+=tempVal
      }
      if(this.objectInsideArray)
      message[0]='Array('+message[0].length+')'+ storeValue+' ]'
      else
      message[0]='Array('+message[0].length+') [ '+message[0]+' ]'
      }
			this.logs.push({
				message: message[0],
				style: 'primary'
      })
    },
    consoleError(...message){
			this.logs.push({
				message: message.join(' '),
				style: 'danger'
			})
    },
    consoleAssert(...message){
      if(message[0]==true)
      message[1]="Assertion true {"+message[1]+"}"
      else
      message[1]="Assertion failed {"+message[1]+"}"
			this.logs.push({
				message: message[1],
				style: 'danger'
			})
		},
		consoleInfo(...message){
			this.logs.push({
				message: message.join(' '),
				style: 'primary'
			})
		},
		consoleWarn(...message){
			this.logs.push({
				message: message.join(' '),
				style: 'danger'
			})
    },
    consoleClear(){
      this.logs=[]
      this.fields=[]
    },
    change(field){
      this.inputField=field
      this.inputField=this.inputField.replace(/\s\s+/g, ' ')
      this.space=this.inputField.lastIndexOf(' ')
      if(this.space>0)
      this.inputValue=this.inputField.substring(this.space+1,this.inputField.length)
      else
      this.inputValue=this.inputField
    },
    setHistory(fields){
      this.history=[]
      fields.filter((field)=>{
        this.history.push(field.commandInput)})
      sessionStorage.setItem('history',JSON.stringify(this.history)) 
      this.getHistory()     
    },
    getHistory(){
      var retrievedData = sessionStorage.getItem("history")
      this.getHistoricalData = JSON.parse(retrievedData)
    },
    printHistory(field){
      if(this.getHistoricalData!=null){
        this.getHistoricalData.filter((history)=>{
          field.commandOutput.push({message:history,style:'primary'})
        })
      }
      else
      field.commandOutput.push({message:'You haven\'t played around here yet !',style:'primary'})
    },
  },
  created(){
    this.getHistory()
    console.log = this.consoleLog
    console.error = this.consoleError
    console.warn = this.consoleWarn
    console.clear = this.consoleClear
    console.assert=this.consoleAssert
    this.members=filterdata.data
    this.ats=filterdata.genCharArray('a','z')
    this.showHelp=filterdata.showHelp
  }
}
</script>

<style>
@import '../assets/main.css';
</style>
