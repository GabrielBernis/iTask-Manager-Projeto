"use strict";
// app.ts
// iTask Manager — lógica principal em TypeScript (POO)
/**
 * Representa uma única tarefa da lista.
 * Guarda seus próprios dados e sabe formatar seu horário de criação.
 */
class Tarefa {
    constructor(titulo, descricao) {
        this.id = Tarefa.proximoId++;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataCriacao = new Date(); // captura o instante exato da criação
        this.concluida = false;
    }
    /** Alterna o status concluída/pendente. */
    alternarStatus() {
        this.concluida = !this.concluida;
    }
    /** Formata a data/hora de criação como dd/mm/aaaa às hh:mm:ss */
    dataFormatada() {
        const d = this.dataCriacao;
        const dia = String(d.getDate()).padStart(2, "0");
        const mes = String(d.getMonth() + 1).padStart(2, "0");
        const ano = d.getFullYear();
        const horas = String(d.getHours()).padStart(2, "0");
        const minutos = String(d.getMinutes()).padStart(2, "0");
        const segundos = String(d.getSeconds()).padStart(2, "0");
        return `${dia}/${mes}/${ano} às ${horas}:${minutos}:${segundos}`;
    }
}
Tarefa.proximoId = 1;
/**
 * Controla o estado da aplicação (lista de tarefas) e é responsável
 * por renderizar essa lista no DOM sempre que ela muda.
 */
class App {
    constructor() {
        this.tarefas = [];
        this.inputTitulo = document.getElementById("input-titulo");
        this.inputDescricao = document.getElementById("input-descricao");
        this.botaoAdicionar = document.getElementById("btn-adicionar");
        this.listaEl = document.getElementById("lista-tarefas");
        this.contadorEl = document.getElementById("contador");
        this.vazioEl = document.getElementById("estado-vazio");
        this.botaoAdicionar.addEventListener("click", () => this.tratarAdicionar());
        // Permite adicionar apertando Enter em qualquer um dos campos
        [this.inputTitulo, this.inputDescricao].forEach((el) => {
            el.addEventListener("keydown", (ev) => {
                if (ev.key === "Enter")
                    this.tratarAdicionar();
            });
        });
        this.renderizar();
    }
    /** Lê os campos do formulário, valida e cria uma nova Tarefa. */
    tratarAdicionar() {
        const titulo = this.inputTitulo.value.trim();
        const descricao = this.inputDescricao.value.trim();
        if (titulo === "") {
            this.inputTitulo.focus();
            this.inputTitulo.classList.add("campo-invalido");
            setTimeout(() => this.inputTitulo.classList.remove("campo-invalido"), 600);
            return;
        }
        const novaTarefa = new Tarefa(titulo, descricao);
        this.tarefas.push(novaTarefa);
        this.inputTitulo.value = "";
        this.inputDescricao.value = "";
        this.inputTitulo.focus();
        this.renderizar();
    }
    /** Alterna o status de uma tarefa pelo id e re-renderiza. */
    tratarToggle(id) {
        const tarefa = this.tarefas.find((t) => t.id === id);
        if (tarefa) {
            tarefa.alternarStatus();
            this.renderizar();
        }
    }
    /** Remove uma tarefa da lista pelo id. */
    tratarRemover(id) {
        this.tarefas = this.tarefas.filter((t) => t.id !== id);
        this.renderizar();
    }
    /** Cria o elemento <li> correspondente a uma tarefa. */
    criarCard(tarefa) {
        const li = document.createElement("li");
        li.className = "card-tarefa" + (tarefa.concluida ? " concluida" : "");
        li.dataset.id = String(tarefa.id);
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox-tarefa";
        checkbox.checked = tarefa.concluida;
        checkbox.setAttribute("aria-label", `Marcar "${tarefa.titulo}" como concluída`);
        checkbox.addEventListener("change", () => this.tratarToggle(tarefa.id));
        const conteudo = document.createElement("div");
        conteudo.className = "conteudo-tarefa";
        const titulo = document.createElement("p");
        titulo.className = "titulo-tarefa";
        titulo.textContent = tarefa.titulo;
        conteudo.appendChild(titulo);
        if (tarefa.descricao !== "") {
            const desc = document.createElement("p");
            desc.className = "descricao-tarefa";
            desc.textContent = tarefa.descricao;
            conteudo.appendChild(desc);
        }
        const meta = document.createElement("p");
        meta.className = "meta-tarefa";
        meta.textContent = `Criada em ${tarefa.dataFormatada()}`;
        conteudo.appendChild(meta);
        const botaoRemover = document.createElement("button");
        botaoRemover.className = "btn-remover";
        botaoRemover.setAttribute("aria-label", `Remover "${tarefa.titulo}"`);
        botaoRemover.textContent = "✕";
        botaoRemover.addEventListener("click", () => this.tratarRemover(tarefa.id));
        li.appendChild(checkbox);
        li.appendChild(conteudo);
        li.appendChild(botaoRemover);
        return li;
    }
    /** Redesenha toda a lista de tarefas no DOM a partir do estado atual. */
    renderizar() {
        this.listaEl.innerHTML = "";
        if (this.tarefas.length === 0) {
            this.listaEl.appendChild(this.vazioEl);
        }
        else {
            for (const tarefa of this.tarefas) {
                this.listaEl.appendChild(this.criarCard(tarefa));
            }
        }
        const concluidas = this.tarefas.filter((t) => t.concluida).length;
        this.contadorEl.textContent = `${concluidas}/${this.tarefas.length} concluídas`;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new App();
});