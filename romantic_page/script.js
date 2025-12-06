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

    // 初始化星星背景（更多星星）
    createStars(100);

    // 开场页面：漂浮小爱心
    startFloatingHearts();

    // 开场页面：流星
    startMeteors();

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

            // 开始背景漂浮文字
            createFloatingTexts();

            // 启动纸飞机
            startPaperPlane();

            // 开始动态寄语轮播
            startDynamicMessages();
            
            // 启动天数计算
            updateDaysCount();
        }, 1000);
    });

    // 11. 开场漂浮小爱心
    function startFloatingHearts() {
        const hearts = ['💜', '💗', '💕', '💖', '✨'];
        
        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = (5 + Math.random() * 3) + 's';
            heart.style.animationDelay = Math.random() * 2 + 's';
            heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
            
            overlay.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 10000);
        }, 800);
    }

    // 12. 流星效果
    function startMeteors() {
        setInterval(() => {
            createMeteor();
        }, 3000); // 每3秒一颗流星
    }

    function createMeteor() {
        const meteor = document.createElement('div');
        meteor.classList.add('meteor');
        
        // 随机起始位置（屏幕上半部分）
        meteor.style.left = (20 + Math.random() * 60) + 'vw';
        meteor.style.top = (5 + Math.random() * 30) + 'vh';
        
        document.body.appendChild(meteor);
        
        // 添加动画类
        setTimeout(() => {
            meteor.classList.add('active');
        }, 10);
        
        // 移除
        setTimeout(() => {
            meteor.remove();
        }, 1500);
    }

    // 9. 计算在一起的天数 (修复版)
    function updateDaysCount() {
        // 使用年月日计算，避免时区问题
        function calculate() {
            const start = new Date(2025, 10, 24); // 月份从0开始，10 = 11月
            const today = new Date();
            // 重置时间部分，只比较日期
            const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            
            const diffTime = todayDay - startDay;
            let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 让第一天算第1天
            if (diffDays < 1) diffDays = 1;
            return diffDays;
        }

        const daysElement = document.getElementById('days-count');
        if (!daysElement) return;

        const targetDays = calculate();

        // 初始滚动动画
        let current = 0;
        const step = Math.max(1, Math.ceil(targetDays / 50)); 
        
        const timer = setInterval(() => {
            current += step;
            if (current >= targetDays) {
                current = targetDays;
                clearInterval(timer);
            }
            daysElement.textContent = current;
        }, 30);

        // 每分钟检查一次日期变化
        setInterval(() => {
            const newDays = calculate();
            if (parseInt(daysElement.textContent) !== newDays) {
                daysElement.textContent = newDays;
            }
        }, 60000);
    }

    // 10. 启动纸飞机动画
    function startPaperPlane() {
        const plane = document.querySelector('.paper-plane');
        if (plane) {
            plane.classList.add('fly');
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
        }, 400); // 每400ms生成一个花瓣
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

    // 5. 生成闪烁星星（更多、更亮）
    function createStars(count = 100) {
        const container = document.body;

        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // 随机位置
            const left = Math.random() * 100 + 'vw';
            const top = Math.random() * 100 + 'vh';
            
            // 随机大小（1-4px，更多大星星）
            const size = Math.random() * 3 + 1 + 'px';
            
            // 随机动画时长和延迟
            const duration = Math.random() * 3 + 1.5 + 's';
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

    // 6. 背景漂浮文字（若隐若现效果）
    const floatingTexts = [
        "我会永远陪着你",
        "想带你去吃好多好吃的",
        "下雨天我一定会去接你",
        "你的每件小事我都放在心上",
        "想和你一起看每一场日落",
        "不管是晴天雨天，我都在",
        "想把世界上最好的都给你",
        "你是我最想留住的幸运",
        "所有的温柔都只想给你",
        "想牵着你的手走过四季",
        "你笑起来的样子真好看"
    ];

    function createFloatingTexts() {
        const container = document.body;
        
        // 创建多个固定位置的漂浮文字
        floatingTexts.forEach((text, index) => {
            const el = document.createElement('div');
            el.classList.add('floating-text');
            el.innerText = text;
            
            // 均匀分布在不同位置
            const row = Math.floor(index / 3);
            const col = index % 3;
            
            el.style.left = (15 + col * 30 + Math.random() * 10) + 'vw';
            el.style.top = (10 + row * 22 + Math.random() * 10) + 'vh';
            
            // 随机动画延迟，让它们不同步
            el.style.animationDelay = (Math.random() * 5) + 's';
            
            // 随机动画时长
            el.style.animationDuration = (8 + Math.random() * 4) + 's';
            
            container.appendChild(el);
        });
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

    // 新增：萌宠召唤逻辑 (修复版)
    window.fetchPet = async function(type) {
        const petDisplay = document.getElementById('pet-display');
        petDisplay.innerHTML = '<div class="pet-placeholder">正在召唤中...</div>';
        
        // 备用图片库（如果API挂了用这些）
        const backupCats = [
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400',
            'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=400',
            'https://images.unsplash.com/photo-1495360019602-e001922a4452?q=80&w=400'
        ];
        const backupDogs = [
            'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400',
            'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=400',
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400'
        ];

        try {
            let imageUrl = '';
            
            // 设置超时，防止一直转圈
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

            if (type === 'cat') {
                // The Cat API
                const res = await fetch('https://api.thecatapi.com/v1/images/search', { signal: controller.signal });
                const data = await res.json();
                imageUrl = data[0].url;
            } else if (type === 'dog') {
                // Dog CEO API
                const res = await fetch('https://dog.ceo/api/breeds/image/random', { signal: controller.signal });
                const data = await res.json();
                imageUrl = data.message;
            }
            clearTimeout(timeoutId);
            
            petDisplay.innerHTML = `<img src="${imageUrl}" alt="cute pet" onload="this.style.opacity=1" style="opacity:0;transition:opacity 0.5s; width:100%; height:100%; object-fit:cover;">`;
            
        } catch (error) {
            console.log("API召唤失败，使用备用图片", error);
            // 随机选一张备用图
            let backupUrl = '';
            if (type === 'cat') {
                backupUrl = backupCats[Math.floor(Math.random() * backupCats.length)];
            } else {
                backupUrl = backupDogs[Math.floor(Math.random() * backupDogs.length)];
            }
            petDisplay.innerHTML = `<img src="${backupUrl}" alt="cute pet" onload="this.style.opacity=1" style="opacity:0;transition:opacity 0.5s; width:100%; height:100%; object-fit:cover;">`;
        }
    }
});
