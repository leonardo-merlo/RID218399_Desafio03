// LocalStorage
const getTasksFromLocalStorage = () => {
    const tasks = JSON.parse(localStorage.getItem("tarefas"));
    return tasks ? tasks : [];
};

const setTasksInLocalStorage = (tasks) => {
    localStorage.setItem("tarefas", JSON.stringify(tasks));
};

// ID para novas tarefas
const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage();
    const lastId = tasks.length ? tasks[tasks.length - 1].id : 0;
    return lastId + 1;
};

// Elementos de "tarefa"
const createTaskElement = (task) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = task.concluida ? "taskDone" : "taskToBeDone";
    taskDiv.id = `tarefa-${task.id}`;

    // nome
    const nomeP = document.createElement("p");
    nomeP.textContent = task.nome;
    nomeP.style.textDecoration = task.concluida ? "line-through" : "";
    nomeP.style.color = task.concluida ? "#8F98A8" : "";

    // infos
    const infoDiv = document.createElement("div");
    infoDiv.className = "taskInfo";

    const etiquetaP = document.createElement("p");
    etiquetaP.textContent = task.etiqueta;

    const dataP = document.createElement("p");
    dataP.textContent = `Criado em: ${task.criadaEm}`;

    infoDiv.appendChild(etiquetaP);
    infoDiv.appendChild(dataP);

    // botão para concluir
    let concluirBtn = null;
    if (!task.concluida) {
        concluirBtn = document.createElement("button");
        concluirBtn.textContent = "Concluir";
        concluirBtn.className = "taskBtn";
        concluirBtn.ariaLabel = "Marcar tarefa como concluída";
        concluirBtn.addEventListener("click", () => concluirTarefa(task.id, true));
    }

    // ícone de concluída
    let checkImg = null;
    if (task.concluida) {
        checkImg = document.createElement("img");
        checkImg.src = "./Checked.png";
        checkImg.alt = "Tarefa concluída";
        checkImg.className = "logoChecked";
    }

    // alinhamentoDOM
    const textoDiv = document.createElement("div");
    textoDiv.className = "taskText";
    textoDiv.appendChild(nomeP);
    textoDiv.appendChild(infoDiv);

    taskDiv.appendChild(textoDiv);
    if (concluirBtn) taskDiv.appendChild(concluirBtn);
    if (checkImg) taskDiv.appendChild(checkImg);

    return taskDiv;
};

// Renderizar
const renderizarTarefas = () => {
    const lista = getTasksFromLocalStorage();
    const taskList = document.querySelector('.taskList');
    taskList.innerHTML = ""; // Limpa tudo antes

    lista.forEach(task => {
        const elem = createTaskElement(task);
        taskList.appendChild(elem);
    });

    const resetBtn = document.getElementById("resetTasks");
    if (lista.length > 0) {
        resetBtn.style.display = "inline-block";  // aparece se houver ao menos uma tarefa
    } else {
        resetBtn.style.display = "none";         // some se não houver tarefas
    }

    atualizarContadorTarefas();
};

// Adicionar tarefa
const adicionarTarefa = (nome, etiqueta) => {
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString("pt-BR");

    const novaTarefa = {
        id: getNewTaskId(),
        nome,
        etiqueta,
        criadaEm: dataFormatada,
        concluida: false
    };

    const lista = getTasksFromLocalStorage();
    lista.push(novaTarefa);
    setTasksInLocalStorage(lista);
    renderizarTarefas();
};

// Tarefa concluída
const concluirTarefa = (id, checked) => {
    const lista = getTasksFromLocalStorage();
    const atualizada = lista.map(task => {
        if (task.id === id) {
            return { ...task, concluida: checked };
        }
        return task;
    });
    setTasksInLocalStorage(atualizada);
    renderizarTarefas();
};

// Contador de tarefas
const atualizarContadorTarefas = () => {
    const lista = getTasksFromLocalStorage();
    const concluidas = lista.filter(task => task.concluida).length;
    const total = lista.length;
    document.querySelector(".taskStatus p").textContent = `Tarefas concluídas: ${concluidas} de ${total}`;
};

// Botão de adicionar tarefas
document.getElementById("MainBtn").addEventListener("click", () => {
    const nomeInput = document.querySelector("#Main input:nth-of-type(1)");
    const etiquetaInput = document.querySelector("#Main input:nth-of-type(2)");
    const nome = nomeInput.value.trim();
    const etiqueta = etiquetaInput.value.trim();

    if (!nome || !etiqueta) {
        alert("Preencha o nome e a etiqueta da tarefa!");
        return;
    }

    adicionarTarefa(nome, etiqueta);

    nomeInput.value = "";
    etiquetaInput.value = "";
});

// Inicializar a página
window.onload = renderizarTarefas;

document.getElementById("resetTasks").addEventListener("click", () => {
    localStorage.removeItem("tarefas");
    renderizarTarefas();
});