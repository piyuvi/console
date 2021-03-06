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
        <md-textarea v-focus="true" @input="change(field.commandInput)" @keydown.enter.prevent class="autogrow" v-model="field.commandInput" v-on:keyup.enter="onSubmit(field)" md-autogrow :readonly="field.readonly">
        </md-textarea>
        </at-ta>
      </b-row>
      <b-row class="output" v-for="(log,index) in field.commandOutput" :key="index">
        <span v-if="field.showOutput" :class="'label-' + log.style">
           <md-icon v-if="log.style=='danger'" class="fa fa-times-circle"></md-icon>
           <md-icon v-else class="fa fa-angle-left"></md-icon>
          <div v-if="!log.type">{{log.message}}</div>
          <tree-view v-if="log.type" :data="log.message" :options="{maxDepth: 7,rootObjectKey:log.header}"></tree-view>
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
      getHistoricalData:[],
      members: [],
      inputArray:[],
      ats:[],
      space:-1,
      inputField:'',
      inputValue:'',
      autocomplete:'',
      showHelp:[],
      nonPrimitive:false
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
      if(field.commandInput.trim() =='') return false;
      field.showOutput=true
      field.readonly=true
      field.showInput=true
      this.logs=[]
      setTimeout(()=>{
      this.fields.push({commandInput:'',readonly:false, showOutput:false,commandOutput:[], afterConsole:''})      
      },1000)
      this.setHistory(field.commandInput)
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
          style: 'primary',
          type:false,
          header:''
        })
        }
        catch(e){
          this.errorFlag=true
          this.logs.push({
            message:e.toString(),
            style:'danger',
            type:false,
            header:''
          })
        }
        this.logs.filter((log)=>{
          field.commandOutput.push({message:log.message,style:log.style,type:log.type,header:log.header})
        })
      }
    },
    consoleLog(...message){
      if(typeof(message[0])=='object'){
        if(Array.isArray(message[0]))
        this.header='Array ('+message[0].length+')'
        else
        this.header='Object'
        this.nonPrimitive=true
      }
      else
        this.nonPrimitive=false;
			this.logs.push({
				message: message[0],
        style: 'primary',
        type:this.nonPrimitive,
        header:this.header
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
      this.getHistoricalData=[]
      sessionStorage.removeItem('history')
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
    setHistory(field){
      if(this.getHistoricalData==null)
        this.getHistoricalData=[]
      this.getHistoricalData.push(field)
      sessionStorage.setItem('history',JSON.stringify(this.getHistoricalData)) 
      this.getHistory()     
    },
    getHistory(){
      var retrievedData = sessionStorage.getItem("history")
      this.getHistoricalData = JSON.parse(retrievedData)
    },
    printHistory(field){
        this.getHistoricalData.filter((history)=>{
          field.commandOutput.push({message:history,style:'primary',type:false,header:''})
        })
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
