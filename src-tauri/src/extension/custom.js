/*
 * This file serves as a collection point for external JS and CSS dependencies.
 * It amalgamates these external resources for easier injection into the application.
 * Additionally, you can directly include any script files in this file
 * that you wish to attach to the application.
 */
console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
)

document.addEventListener('DOMContentLoaded', () => {
    const originalWindowOpen = window.open
    window.open = function (url, _, features) {
        return originalWindowOpen.call(window, url, '_self', features)
    }
    console.log('window.open has been overridden to open in the current page.')
})

document.addEventListener('DOMContentLoaded', () => {
    const targetNode = document.body
    // 配置观察选项
    const config = {
        childList: true,
        subtree: true,
    }
    const observer = new MutationObserver((mutationsList, observer) => {
        let htmlContent = document.documentElement.innerHTML
        for (const mutation of mutationsList) {
            if (
                mutation.type === 'childList' &&
                htmlContent.includes('_blank')
            ) {
                const links = document.querySelectorAll('a[target="_blank"]')
                links.forEach((link) => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault()
                        window.location.href = link.href
                    })
                })
            }
        }
    })
    observer.observe(targetNode, config)
})

// css filter
document.addEventListener('DOMContentLoaded', () => {
    const targetNode = document.body
    // 配置观察选项
    const config = {
        childList: true,
        subtree: true,
    }
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const element0 = document.querySelector('test');
                if (element0) {
                    element0.style.display = 'none';
                }
            }
        }
    })
    observer.observe(targetNode, config)
})
// end css filter

// inject-app-info.js
// 注入应用信息
window.addEventListener('DOMContentLoaded', () => {
    const APP_NAME = 'zserptest';
    const APP_VERSION = '1.0.5';
    
    const appInfo = {
        name: APP_NAME,
        version: APP_VERSION,
        isPakeApp: true
    };
    window.PAKEPLUS_APP = appInfo;
    
    // 缓存key常量
    const CACHE_KEY = {
        USER: 'user',
        ROLE_ROUTERS: 'roleRouters',
        ACCESS_TOKEN: 'ACCESS_TOKEN',
        REFRESH_TOKEN: 'REFRESH_TOKEN'
    };
    
    // 清除登录信息
    function clearLoginInfo() {
        // 1. 清除 Token
        localStorage.removeItem(CACHE_KEY.ACCESS_TOKEN);
        localStorage.removeItem(CACHE_KEY.REFRESH_TOKEN);
        
        // 2. 清除用户信息
        localStorage.removeItem(CACHE_KEY.USER);
        
        // 3. 清除路由信息
        localStorage.removeItem(CACHE_KEY.ROLE_ROUTERS);
        
        console.log('已清除登录信息');
    }
    
    // 判断当前页面是否是登录页
    function isLoginPage() {
        const currentPath = window.location.pathname;
        return currentPath.startsWith('/login');
    }
    
    // 只在登录页面清除登录信息和显示通知
    if (isLoginPage()) {
        // 清除登录信息
        clearLoginInfo();
        console.log(`${window.location.pathname} 页面已清除登录信息`);
        
        // 创建通知元素
        const notificationDiv = document.createElement('div');
        notificationDiv.style.cssText = `
            position: fixed;
            top: 16px;
            left: 16px;
            background: linear-gradient(145deg, #42b883, #35495e);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            user-select: none;
            pointer-events: auto;
        `;
        
        // 设置通知内容
        notificationDiv.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">
                ${appInfo.name}
            </div>
            <div style="font-size: 12px; opacity: 0.9;">
                版本 ${appInfo.version}
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(notificationDiv);
        
        // 5秒后淡出并移除元素
        setTimeout(() => {
            notificationDiv.style.opacity = '0';
            // 等待淡出动画完成后移除元素
            setTimeout(() => {
                notificationDiv.remove();
            }, 300); // 300ms 是 transition 的持续时间
        }, 5000);
    }
    
    // 分发就绪事件
    const event = new CustomEvent('pakeplusReady', { detail: appInfo });
    window.dispatchEvent(event);
    
    // 检查是否在 PakePlus 应用中运行
    window.isPakePlusApp = () => {
        return window.PAKEPLUS_APP && window.PAKEPLUS_APP.isPakeApp === true;
    };
    
    // 获取应用版本
    window.getPakePlusVersion = () => {
        return window.PAKEPLUS_APP ? window.PAKEPLUS_APP.version : null;
    };
    
    console.log('PakePlus 应用信息:', appInfo);
}); 
// end inject-app-info.js