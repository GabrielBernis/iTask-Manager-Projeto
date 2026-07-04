
class Tarefa {
  private static proximoId: number = 1;

  public readonly id: number;
  public titulo: string;
  public descricao: string;
  public readonly dataCriacao: Date;
  public concluida: boolean;

  constructor(titulo: string, descricao: string) {
    this.id = Tarefa.proximoId++;
    this.titulo = titulo;
    this.descricao = descricao;
    this.dataCriacao = new Date(); // captura o instante exato da criação
    this.concluida = false;
  }

  
  public alternarStatus(): void {
    this.concluida = !this.concluida;
  }

  
  public dataFormatada(): string {
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


class App {
  private tarefas: Tarefa[] = [];

  private inputTitulo: HTMLInputElement;
  private inputDescricao: HTMLInputElement;
  private botaoAdicionar: HTMLButtonElement;
  private listaEl: HTMLUListElement;
  private contadorEl: HTMLSpanElement;
  private vazioEl: HTMLLIElement;

  constructor() {
    this.inputTitulo = document.getElementById("input-titulo") as HTMLInputElement;
    this.inputDescricao = document.getElementById("input-descricao") as HTMLInputElement;
    this.botaoAdicionar = document.getElementById("btn-adicionar") as HTMLButtonElement;
    this.listaEl = document.getElementById("lista-tarefas") as HTMLUListElement;
    this.contadorEl = document.getElementById("contador") as HTMLSpanElement;
    this.vazioEl = document.getElementById("estado-vazio") as HTMLLIElement;

    this.botaoAdicionar.addEventListener("click", () => this.tratarAdicionar());

    
    [this.inputTitulo, this.inputDescricao].forEach((el) => {
      el.addEventListener("keydown", (ev: KeyboardEvent) => {
        if (ev.key === "Enter") this.tratarAdicionar();
      });
    });

    this.renderizar();
  }

  
  private tratarAdicionar(): void {
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

  
  private tratarToggle(id: number): void {
    const tarefa = this.tarefas.find((t) => t.id === id);
    if (tarefa) {
      tarefa.alternarStatus();
      this.renderizar();
    }
  }

  
  private tratarRemover(id: number): void {
    this.tarefas = this.tarefas.filter((t) => t.id !== id);
    this.renderizar();
  }

  
  private criarCard(tarefa: Tarefa): HTMLLIElement {
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

  
  public renderizar(): void {
    this.listaEl.innerHTML = "";

    if (this.tarefas.length === 0) {
      this.listaEl.appendChild(this.vazioEl);
    } else {
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