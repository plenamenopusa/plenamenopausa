// Configuração da API do Cloudflare
const CLOUDFLARE_API_URL = 'https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/d1/database/YOUR_DATABASE_ID/execute';
const CLOUDFLARE_API_TOKEN = 'YOUR_API_TOKEN';

// Validação e formatação de WhatsApp
function formatWhatsApp(input) {
    // Remove todos os caracteres não numéricos
    let value = input.value.replace(/\D/g, '');
    
    // Aplica a máscara (11) 99999-9999
    if (value.length >= 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}${value.length > 7 ? '-' + value.slice(7, 11) : ''}`;
    }
    
    input.value = value;
}

// Validação de email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validação de data de nascimento
function validateBirthDate(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1;
    }
    
    return age;
}

// Validação do formulário
function validateForm(formData) {
    const errors = [];
    
    // Validar nome
    if (!formData.nome || formData.nome.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    // Validar data de nascimento
    if (!formData.dataNascimento) {
        errors.push('Data de nascimento é obrigatória');
    } else {
        const age = validateBirthDate(formData.dataNascimento);
        if (age < 18) {
            errors.push('Idade mínima de 18 anos');
        }
        if (age > 100) {
            errors.push('Data de nascimento inválida');
        }
    }
    
    // Validar email
    if (!formData.email || !validateEmail(formData.email)) {
        errors.push('Email inválido');
    }
    
    // Validar WhatsApp
    const whatsappNumbers = formData.whatsapp.replace(/\D/g, '');
    if (!formData.whatsapp || whatsappNumbers.length < 10) {
        errors.push('WhatsApp deve ter pelo menos 10 dígitos');
    }
    
    return errors;
}

// Envio dos dados para Cloudflare
async function sendToCloudflare(formData) {
    try {
        const response = await fetch(CLOUDFLARE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sql: `INSERT INTO leads (nome, data_nascimento, email, whatsapp, data_cadastro) 
                      VALUES (?, ?, ?, ?, ?)`,
                params: [
                    formData.nome,
                    formData.dataNascimento,
                    formData.email,
                    formData.whatsapp.replace(/\D/g, ''),
                    new Date().toISOString()
                ]
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        throw error;
    }
}

// Fallback: Envio por email usando EmailJS (alternativa ao Cloudflare)
function sendEmailFallback(formData) {
    // Esta é uma implementação de fallback caso o Cloudflare não esteja configurado
    // Você pode usar EmailJS, Formspree, ou outro serviço de formulário
    
    const emailBody = `
        Nova lead capturada - Plena Menopausa
        
        Nome: ${formData.nome}
        Data de Nascimento: ${formData.dataNascimento}
        Email: ${formData.email}
        WhatsApp: ${formData.whatsapp}
        Data/Hora: ${new Date().toLocaleString('pt-BR')}
    `;
    
    // Aqui você pode implementar o envio por email
    // Por exemplo, usando EmailJS:
    // emailjs.send('service_id', 'template_id', {
    //     to_email: 'contato@plenamenopausa.com.br',
    //     subject: 'Nova Lead - Plena Menopausa',
    //     message: emailBody
    // });
    
    console.log('Dados da lead:', formData);
    console.log('Email body:', emailBody);
    
    // Simular sucesso para demonstração
    return Promise.resolve({ success: true });
}

// Smooth scroll para links internos
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll para o link "Junte-se a nós"
    const navLink = document.querySelector('.nav-link');
    if (navLink) {
        navLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#formulario');
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('successMessage');
    
    // Aplicar máscara no campo WhatsApp
    const whatsappInput = document.getElementById('whatsapp');
    whatsappInput.addEventListener('input', function() {
        formatWhatsApp(this);
    });
    
    // Manipulador do envio do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const formData = {
            nome: document.getElementById('nome').value.trim(),
            dataNascimento: document.getElementById('dataNascimento').value,
            email: document.getElementById('email').value.trim(),
            whatsapp: document.getElementById('whatsapp').value
        };
        
        // Validar formulário
        const errors = validateForm(formData);
        if (errors.length > 0) {
            alert('Por favor, corrija os seguintes erros:\n' + errors.join('\n'));
            return;
        }
        
        // Mostrar estado de carregamento
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        try {
            // Tentar enviar para Cloudflare primeiro
            try {
                await sendToCloudflare(formData);
                console.log('Dados enviados para Cloudflare com sucesso');
            } catch (cloudflareError) {
                console.warn('Erro ao enviar para Cloudflare, usando fallback:', cloudflareError);
                await sendEmailFallback(formData);
            }
            
            // Mostrar mensagem de sucesso
            form.style.display = 'none';
            successMessage.classList.add('show');
            
            // Scroll para a mensagem de sucesso
            successMessage.scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            alert('Ocorreu um erro ao enviar o formulário. Tente novamente ou entre em contato conosco.');
        } finally {
            // Restaurar estado do botão
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
    
    // Validação em tempo real
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.type === 'email' && this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#FF5722';
            } else if (this.type === 'date' && this.value) {
                const age = validateBirthDate(this.value);
                if (age < 18 || age > 100) {
                    this.style.borderColor = '#FF5722';
                } else {
                    this.style.borderColor = '#4CAF50';
                }
            } else if (this.value) {
                this.style.borderColor = '#4CAF50';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor === '#FF5722' && this.value) {
                this.style.borderColor = '#E0E0E0';
            }
        });
    });
});

// Função para configurar Cloudflare (chamada manual)
function setupCloudflare() {
    console.log(`
    Para configurar o Cloudflare, você precisa:
    
    1. Criar uma conta no Cloudflare
    2. Configurar um banco de dados D1
    3. Criar a tabela 'leads' com os campos:
       - id (INTEGER PRIMARY KEY AUTOINCREMENT)
       - nome (TEXT)
       - data_nascimento (TEXT)
       - email (TEXT)
       - whatsapp (TEXT)
       - data_cadastro (TEXT)
    4. Obter o Account ID e API Token
    5. Atualizar as constantes no início deste arquivo
    
    SQL para criar a tabela:
    CREATE TABLE leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        data_nascimento TEXT NOT NULL,
        email TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        data_cadastro TEXT NOT NULL
    );
    `);
}

// Expor função para configuração
window.setupCloudflare = setupCloudflare;
