import { logarTempoDeExecucao } from "../decorations/logar-tempo-de-execucao.js";
import { DiaDaSemana } from "../enums/dias-da-semana.js";
import { Negociacao } from "../models/negociacao.js";
import { Negociacoes } from "../models/negociacoes.js";
import { mensagemView } from "../views/mensagem-view.js";
import { NegociacoesView } from "../views/negociacoes-view.js";

export class NegociacaoController {
    private inputData : HTMLInputElement
    private inputQuantidade : HTMLInputElement
    private inputvalor : HTMLInputElement
    private negociacoes = new Negociacoes()
    //passei o id da div que vai conter a tabela com os dados na negociação
    private negociacoesView = new NegociacoesView
    ('#negociaçõesView', true);
    private mensagem = new mensagemView('#mensagemView');


    constructor() {
        // TS sabe que o querySlector pode receber um HTML ou null, mas ele deixa essa verificação baixo

        // eu to assuminto que o tipo vai ser HTMLInputElment e assim não vou precisar tratar o input

        // Elementos que vem do Dom, não preciso tratalo caso ele seja nulo
        this.inputData = <HTMLInputElement> document.querySelector('#data')
        this.inputQuantidade = document.querySelector('#quantidade') as HTMLInputElement
        this.inputvalor = document.querySelector('#valor') as HTMLInputElement
        this.negociacoesView.update(this.negociacoes)
    }

    //decorator, erro é resolvido com uma configuração no compilador
    @logarTempoDeExecucao()
    public adiciona(): void{

        const negociacao = Negociacao.criaDe(
            this.inputData.value,
            this.inputQuantidade.value,
            this.inputvalor.value
        )
       
        if(!this.ehDiaUtil(negociacao.data)){
                this.mensagem.update('Apenas negociações em dias úteis são aceitas')
            return
        }
      
        this.negociacoes.adiciona(negociacao)
        this.limparForm()
        this.atualizaView();

    }

    private ehDiaUtil(data: Date){
        return data.getDay() > DiaDaSemana.DOMINGO 
        && data.getDay() < DiaDaSemana.SABADO
    }


    private limparForm(): void {
        this.inputData.value = ''
        this.inputQuantidade.value = ''
        this.inputvalor.value = ''

        this.inputData.focus()
    }

    private atualizaView(): void{
        this.negociacoesView.update(this.negociacoes)
        this.mensagem.update('Negociação adicionada com sucesso')
    }
}