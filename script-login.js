document.getElementById('loginform').addEventListener('submit',function(event){
    event.preventDefault(); //Serve para recarregar a página

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    //Validação Básica
    if(user==='admin' && pass ==='1234'){
        window.location.href = 'index.html'; //Manda para Página
    } else{
        document.getElementById('error').textContent = 'Usuário ou senha incorretos';
    }

})