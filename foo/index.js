
Vue.component('quiz', {
  template:`
<div>
  <div v-if="introStage">
    <slot name="intro" :title="title">
    <h1>Welcome to the Quiz: {{title}}</h1>
    <p>
      Some kind of text here. Blah blah.
    </p>
    </slot>
    <button @click="startQuiz">START!</button>
  </div>

  <div v-if="questionStage">
    <question
              :question="questions[currentQuestion]"
              v-on:answer="handleAnswer"
              :question-number="currentQuestion+1"
    ></question>
  </div>

  <div v-if="resultsStage">
    <slot name="results" :length="questions.length" :perc="perc" :correct="correct">
    You got {{correct}} right out of {{questions.length}} questions. Your percentage is {{perc}}%.
    </slot>
  </div>
</div>
`,
  props:['url'],
  data() {
    return {
      introStage:false,
      questionStage:false,
      resultsStage:false,
      title:'',
      questions:[],
      currentQuestion:0,
      answers:[],
      correct:0,
      perc:null
    }
  },
  created() {
    fetch(this.url)
    .then(res => res.json())
    .then(res => {
      this.title = res.title;
      this.questions = res.questions;
      this.introStage = true;
    })

  },
  methods:{
    startQuiz() {
      this.introStage = false;
      this.questionStage = true;
    },
    handleAnswer(e) {
      console.log('answer event ftw',e);
      this.answers[this.currentQuestion]=e.answer;
      if((this.currentQuestion+1) === this.questions.length) {
        this.handleResults();
        this.questionStage = false;
        this.resultsStage = true;
      } else {
        this.currentQuestion++;
      }
    },
    handleResults() {
      console.log('handle results');
      this.questions.forEach((a, index) => {
        if(this.answers[index] === a.answer) this.correct++;
      });
      this.perc = ((this.correct / this.questions.length)*100).toFixed(2);
      console.log(this.correct+' '+this.perc);
    }
  }

});

Vue.component('question', {
	template:`
<div>
  <strong>Question {{ questionNumber }}:</strong><br/>
  <strong>{{ question.text }} </strong>

  <div v-if="question.type === 'tf'">
    <input type="radio" name="currentQuestion" id="trueAnswer" v-model="answer" value="t"><label for="trueAnswer">True</label><br/>
    <input type="radio" name="currentQuestion" id="falseAnswer" v-model="answer" value="f"><label for="falseAnswer">False</label><br/>
  </div>

  <div v-if="question.type === 'mc'">
    <div v-for="(mcanswer,index) in question.answers">
    <input type="radio" :id="'answer'+index" name="currentQuestion" v-model="answer" :value="mcanswer"><label :for="'answer'+index">{{mcanswer}}</label><br/>
    </div>
  </div>

  <button @click="submitAnswer">Answer</button>
</div>
`,
  data() {
     return {
       answer:''
     }
  },
	props:['question','question-number'],
	methods:{
		submitAnswer:function() {
			this.$emit('answer', {answer:this.answer});
      this.answer = null;
		}
	}
});

const app = new Vue({
  el:'#quiz',
  data() {
    return {
    }
  }
});
