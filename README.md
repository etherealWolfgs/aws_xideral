# 🐧 Guía para configurar un entorno de desarrollo en Windows con WSL, Docker, pyenv y Jupyter

Esta guía está diseñada para montar un entorno de trabajo completo de jupyter notebook en Ubuntu mediante WSL en Windows. Incluye la instalación de un subsistema Linux (WSL), la terminal mejorada con Zsh, Docker para contenedores y un entorno Python aislado con pyenv y Jupyter Notebook.

## 📋 Tabla de contenido

- [1. Instalación y configuración de WSL en Windows](#1-instalación-y-configuración-de-wsl-en-windows)
- [2. Instalación de Ubuntu (última versión estable) en WSL](#2-instalación-de-ubuntu-última-versión-estable-en-wsl)
- [3. Instalación de Zsh y Oh My Zsh](#3-instalación-de-zsh-y-oh-my-zsh)
- [4. Instalación de Docker en Ubuntu](#4-instalación-de-docker-en-ubuntu)
- [5. Configuración posterior: ejecutar Docker sin sudo](#5-configuración-posterior-ejecutar-docker-sin-sudo)
- [6. Instalación de Python con pyenv y Jupyter Notebook](#6-instalación-de-python-con-pyenv-y-jupyter-notebook)
- [Uso cotidiano](#uso-cotidiano)
- [Resumen](#resumen)

---

## 1. Instalación y configuración de WSL en Windows

WSL (Windows Subsystem for Linux) permite ejecutar un sistema Linux dentro de Windows de forma nativa, sin necesidad de máquinas virtuales. Es la base para tener un entorno de desarrollo similar al de un servidor típico.

1. Abre **PowerShell** o **Terminal de Windows** como administrador.
   (Haz clic derecho en el botón Inicio y selecciona la opción correspondiente).

2. Ejecuta el siguiente comando para instalar WSL con la configuración predeterminada:

   ```powershell
   wsl --install
   ```

   Este comando habilita WSL e instala la distribución Ubuntu por defecto.

3. **Reinicia el equipo** cuando el proceso haya finalizado para que los cambios surtan efecto.

> ⚠️ Si tu versión de Windows es anterior a la 2004, es posible que este comando no funcione. En ese caso, consulta la documentación oficial de Microsoft para la instalación manual.

---

## 2. Instalación de Ubuntu (última versión estable) en WSL

Tras el reinicio, WSL ya tendrá Ubuntu instalado. Sin embargo, para mayor control, instalaremos explícitamente la versión LTS más reciente (actualmente 24.04).

1. Abre PowerShell (sin necesidad de permisos de administrador) y ejecuta:

   ```powershell
   wsl --install Ubuntu-24.04
   ```

2. Espera a que finalice la descarga e instalación. Se abrirá automáticamente una ventana de terminal con Ubuntu.

3. Crea un nombre de usuario y una contraseña cuando se te solicite. Esta contraseña será la que uses para tareas administrativas (como instalar paquetes) y es importante que la recuerdes.

---

## 3. Instalación de Zsh y Oh My Zsh

Zsh es un intérprete de comandos con funcionalidades avanzadas que mejoran la experiencia en la terminal. Oh My Zsh es un framework que añade temas, plugins y atajos útiles.

1. Abre la aplicación **Ubuntu** desde el menú de inicio para acceder a la terminal.

2. Actualiza los repositorios de paquetes:

   ```bash
   sudo apt update
   ```

3. Instala Zsh junto con `git` y `curl`, necesarios para la instalación posterior:

   ```bash
   sudo apt install zsh git curl -y
   ```

4. Instala Oh My Zsh ejecutando el script oficial:

   ```bash
   sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
   ```

   Este script configura Zsh como terminal por defecto y aplica los ajustes de Oh My Zsh. Al finalizar, verás un cambio en la apariencia de la terminal.

---

## 4. Instalación de Docker en Ubuntu

Docker es una plataforma que permite empaquetar aplicaciones en contenedores, garantizando que funcionen de forma consistente en cualquier entorno.

### 4.1. Desinstalación de paquetes conflictivos

Antes de instalar Docker desde el repositorio oficial, conviene eliminar versiones antiguas o paquetes no oficiales que puedan interferir. Ejecuta:

```bash
sudo apt remove docker.io docker-compose docker-compose-v2 docker-doc docker-buildx podman-docker containerd runc
```

> Si algunos paquetes no están instalados, el sistema lo notificará y continuará sin problemas.

### 4.2. Instalación desde el repositorio oficial

Sigue estos pasos para agregar el repositorio oficial y instalar Docker:

1. Actualiza los paquetes del sistema:

   ```bash
   sudo apt update
   ```

2. Instala las dependencias necesarias para manejar repositorios mediante HTTPS:

   ```bash
   sudo apt install ca-certificates curl -y
   ```

3. Agrega la clave GPG oficial de Docker:

   ```bash
   sudo install -m 0755 -d /etc/apt/keyrings
   sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
   sudo chmod a+r /etc/apt/keyrings/docker.asc
   ```

4. Añade el repositorio de Docker a las fuentes de APT:

   ```bash
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

5. Actualiza la lista de paquetes para incluir los del nuevo repositorio:

   ```bash
   sudo apt update
   ```

6. Instala Docker Engine y sus componentes:

   ```bash
   sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
   ```

### 4.3. Verificación de la instalación

Para comprobar que Docker se ha instalado correctamente, ejecuta el contenedor de prueba:

```bash
sudo docker run hello-world
```

Si ves un mensaje de bienvenida, la instalación ha sido exitosa.

---

## 5. Configuración posterior: ejecutar Docker sin sudo

Por defecto, Docker requiere privilegios de administrador. Para evitar tener que escribir `sudo` en cada comando, puedes agregar tu usuario al grupo `docker`.

1. Ejecuta:

   ```bash
   sudo usermod -aG docker $USER
   ```

2. Para aplicar el cambio, cierra la terminal de Ubuntu y vuelve a abrirla. Alternativamente, puedes usar:

   ```bash
   newgrp docker
   ```

3. Verifica que funciona sin `sudo`:

   ```bash
   docker run hello-world
   ```

   Si el comando se ejecuta sin errores, la configuración es correcta.

---

## 6. Instalación de Python con pyenv y Jupyter Notebook

`pyenv` permite gestionar múltiples versiones de Python en el mismo sistema sin conflictos. Jupyter Notebook es una aplicación web que facilita la escritura y ejecución de código Python en celdas, ideal para análisis de datos, aprendizaje y prototipado.

A continuación se detallan todos los pasos necesarios, desde la instalación de las dependencias del sistema hasta la puesta en marcha de Jupyter.

### 6.1. Instalación de dependencias del sistema

Primero, instala los paquetes requeridos para compilar Python desde el código fuente:

```bash
sudo apt install -y \
  make \
  build-essential \
  libssl-dev \
  zlib1g-dev \
  libbz2-dev \
  libreadline-dev \
  libsqlite3-dev \
  curl \
  llvm \
  libncursesw5-dev \
  xz-utils \
  tk-dev \
  libxml2-dev \
  libxmlsec1-dev \
  libffi-dev \
  liblzma-dev
```

### 6.2. Instalación de pyenv

Clona el repositorio de pyenv en el directorio `~/.pyenv`:

```bash
git clone https://github.com/pyenv/pyenv.git ~/.pyenv
```

Verifica que la carpeta se haya creado correctamente:

```bash
ls ~/.pyenv
```

### 6.3. Configuración de variables de entorno en Zsh

Agrega las siguientes líneas al archivo `~/.zshrc` para que pyenv esté disponible en cada sesión de terminal:

```bash
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init - zsh)"' >> ~/.zshrc
```

Recarga la configuración de Zsh:

```bash
source ~/.zshrc
```

Verifica que pyenv esté instalado correctamente:

```bash
pyenv --version
```

### 6.4. Instalación de una versión específica de Python

Lista las versiones disponibles de Python (filtra por la 3.14):

```bash
pyenv install --list | grep " 3.14"
```

Instala Python 3.14.7 (o la versión que desees):

```bash
pyenv install 3.14.7
```

Muestra las versiones instaladas y confirma que aparece la recién instalada:

```bash
pyenv versions
```

Establece Python 3.14.7 como la versión global por defecto:

```bash
pyenv global 3.14.7
```

Ejecuta un rehash para actualizar los enlaces simbólicos:

```bash
pyenv rehash
```

Verifica que el comando `python` apunte a la versión correcta:

```bash
python --version
```

La salida debe ser similar a:

```
Python 3.14.7
```

### 6.5. Creación del entorno virtual y instalación de Jupyter

Crea un directorio para tu workspace (por ejemplo, `jupyter`):

```bash
mkdir -p ~/jupyter
```

Accede a él:

```bash
cd ~/jupyter
```

Confirma nuevamente la versión de Python (debe seguir siendo 3.14.7):

```bash
python --version
```

Crea un entorno virtual (llamado `.venv`):

```bash
python -m venv .venv
```

Activa el entorno virtual:

```bash
source .venv/bin/activate
```

Verás el prefijo `(.venv)` en el prompt, indicando que estás dentro del entorno.

Actualiza `pip` (el gestor de paquetes de Python) a la última versión:

```bash
python -m pip install --upgrade pip
```

Instala Jupyter Notebook:

```bash
pip install notebook
```

Instala el kernel de IPython (necesario para ejecutar código en los cuadernos):

```bash
pip install ipykernel
```

### 6.6. Lanzar Jupyter Notebook

Finalmente, inicia Jupyter Notebook:

```bash
jupyter notebook
```

Esto abrirá automáticamente una pestaña en tu navegador con el panel de control de Jupyter, donde podrás crear y gestionar cuadernos.

---

## Uso cotidiano

Cuando quieras volver a trabajar con Jupyter:

1. Abre la terminal de Ubuntu.
2. Navega a tu workspace: `cd ~/jupyter`
3. Activa el entorno virtual: `source .venv/bin/activate`
4. Ejecuta: `jupyter notebook`

---

## Si todo salió bien, deberías de ver algo asi en tu navegador

<img width="1917" height="625" alt="Captura de pantalla 2026-09-07 153854" src="https://github.com/user-attachments/assets/8b3924ce-d3e3-4d6e-9f58-67dc07913978" />

