document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const startBtn = document.getElementById('start-btn');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const typingTitle = document.getElementById('typing-title');
    const typingText = document.getElementById('typing-text');
    const dynamicMessages = document.getElementById('dynamic-messages');

    let isMusicPlaying = false;

    // 初始化星星背景
    createStars();

    // 7. 开场打字机效果
    const titleStr = "To: 田小昕";
    const textStr = "准备好，去见证属于我们的紫色浪漫了吗？";

    // 递归打字函数
    function typeWriter(element, text, i, callback) {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            setTimeout(() => {
                typeWriter(element, text, i + 1, callback);
            }, 100);
        } else if (callback) {
            setTimeout(callback, 500);
        }
    }

    // 开始打字动画链
    typeWriter(typingTitle, titleStr, 0, () => {
        typeWriter(typingText, textStr, 0, () => {
            // 显示按钮
            startBtn.style.opacity = '1';
            startBtn.style.transform = 'translateY(0)';
        });
    });


    // 1. 点击开始按钮的逻辑
    startBtn.addEventListener('click', () => {
        // 激活新转场特效 (光圈扩散)
        overlay.classList.add('active-transition');

        // 1秒后淡出遮罩并显示主内容
        setTimeout(() => {
            overlay.classList.add('fade-out');
            mainContent.style.opacity = '1';
            
            // 尝试播放音乐
            playMusic();

            // 开始花瓣特效
            startPetals();

            // 开始飘浮承诺文案
            startPromises();

            // 开始动态寄语轮播
            startDynamicMessages();
            
            // 启动天数计算
            updateDaysCount();
        }, 1000);
    });

    // 9. 计算在一起的天数
    function updateDaysCount() {
        const startDate = new Date('2025-11-24');
        const today = new Date();
        
        // 算出相差毫秒数
        const diffTime = Math.abs(today - startDate);
        // 换算成天数 (向上取整，第一天算1天)
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) diffDays = 1; // 至少显示1天
        
        const daysElement = document.getElementById('days-count');
        if (daysElement) {
            // 数字滚动动画
            let current = 0;
            const target = diffDays;
            // 如果数字很大，步长要大一点
            const step = Math.max(1, Math.ceil(target / 50)); 
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                daysElement.textContent = current;
            }, 30);
        }
    }

    // 8. 动态寄语轮播逻辑
    const messagesList = [
        `<p>第 57 次取消发送</p><p>终于变成了第 1 次勇敢</p>`,
        `<p>其实我想说...</p><p>有些话藏在心里太久了</p>`,
        `<p>每次看到紫色的花</p><p>就会想起你</p>`,
        `<p>愿世间美好</p><p>与你环环相扣</p>`,
        `<p style="font-size:1.5rem;color:#ff4081">我喜欢你 ❤</p>`
    ];
    
    let msgIndex = 0;

    function startDynamicMessages() {
        showNextMessage();
        setInterval(showNextMessage, 4000); // 每4秒切换一次
    }

    function showNextMessage() {
        // 淡出当前内容
        dynamicMessages.style.opacity = '0';
        
        setTimeout(() => {
            // 切换内容
            dynamicMessages.innerHTML = `<div class="dynamic-text">${messagesList[msgIndex]}</div>`;
            
            // 淡入
            dynamicMessages.style.opacity = '1';

            // 索引循环
            msgIndex = (msgIndex + 1) % messagesList.length;
        }, 500); // 等待淡出动画
    }


    // 2. 音乐控制逻辑
    function playMusic() {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggle.classList.remove('paused');
        }).catch(err => {
            console.log("自动播放被拦截，等待交互", err);
        });
    }

    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.classList.add('paused');
        } else {
            bgMusic.play();
            musicToggle.classList.remove('paused');
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // 4. 花瓣飘落特效
    function startPetals() {
        const container = document.body;
        
        setInterval(() => {
            createPetal(container);
        }, 300); // 每300ms生成一个花瓣
    }

    function createPetal(container) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // 随机大小、位置、颜色
        const size = Math.random() * 10 + 10 + 'px'; // 10-20px
        const left = Math.random() * 100 + 'vw';
        const animationDuration = Math.random() * 5 + 5 + 's'; // 5-10s
        
        // 定义随机颜色 (紫色系)
        const colors = ['#d500f9', '#aa00ff', '#e1bee7', '#ff4081'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        petal.style.width = size;
        petal.style.height = size;
        petal.style.left = left;
        petal.style.backgroundColor = randomColor;
        petal.style.position = 'fixed';
        petal.style.top = '-20px';
        petal.style.zIndex = '-1';
        
        // 应用动画
        petal.style.animation = `floatPetal ${animationDuration} linear forwards`;

        container.appendChild(petal);

        // 动画结束后移除元素，防止内存泄漏
        setTimeout(() => {
            petal.remove();
        }, parseFloat(animationDuration) * 1000);
    }

    // 5. 生成闪烁星星
    function createStars() {
        const container = document.body;
        const starCount = 60; // 星星数量

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // 随机位置
            const left = Math.random() * 100 + 'vw';
            const top = Math.random() * 100 + 'vh';
            
            // 随机大小
            const size = Math.random() * 2 + 1 + 'px';
            
            // 随机动画时长和延迟
            const duration = Math.random() * 3 + 2 + 's'; // 2-5s
            const delay = Math.random() * 5 + 's';
            
            star.style.left = left;
            star.style.top = top;
            star.style.width = size;
            star.style.height = size;
            star.style.animationDuration = duration;
            star.style.animationDelay = delay;
            
            container.appendChild(star);
        }
    }

    // 6. 飘浮承诺文案
    const promises = [
        "我会永远陪着你",
        "想带你去吃好多好吃的",
        "下雨天我一定会去接你",
        "你的每件小事我都放在心上",
        "想和你一起看每一场日落",
        "不管是晴天雨天，我都在",
        "想把世界上最好的都给你",
        "你是我最想留住的幸运",
        "所有的温柔都只想给你",
        "我们一起去更多的地方",
        "每天都要开开心心的",
        "只要你需要，我随时都在",
        "想牵着你的手走过四季",
        "你笑起来的样子真好看"
    ];

    function startPromises() {
        const container = document.body;
        // 立即生成一个
        createPromise(container);
        
        setInterval(() => {
            createPromise(container);
        }, 2500); // 每2.5秒生成一句
    }

    function createPromise(container) {
        const text = document.createElement('div');
        text.classList.add('promise-text');
        text.innerText = promises[Math.floor(Math.random() * promises.length)];
        
        // 随机位置 (水平随机，垂直从下往上)
        const left = Math.random() * 80 + 10 + 'vw'; // 10-90vw
        const duration = Math.random() * 5 + 10 + 's'; // 10-15s 慢慢飘
        const size = Math.random() * 0.5 + 1.2 + 'rem'; // 字体大小
        
        text.style.left = left;
        text.style.fontSize = size;
        text.style.animationDuration = duration;
        
        container.appendChild(text);
        
        setTimeout(() => {
            text.remove();
        }, parseFloat(duration) * 1000);
    }

    // 新增：模态框逻辑
    window.showModal = function(element, message) {
        const modal = document.getElementById('photo-modal');
        const modalImg = document.getElementById('modal-img');
        const modalText = document.getElementById('modal-text');
        const imgSrc = element.querySelector('img').src;

        modalImg.src = imgSrc;
        modalText.textContent = message;
        
        modal.style.display = 'flex';
        // 强制重绘以触发 transition
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    // 关闭模态框逻辑
    const closeBtn = document.querySelector('.close-btn');
    const modal = document.getElementById('photo-modal');
    
    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal();
        });
    }
    
    // 点击外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
});
