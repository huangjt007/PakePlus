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
        console.log(
            'window.open has been overridden to open in the current page.'
        )
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

    // 注入日志函数
    window.__pakeLog = async function(message, type = 'info') {
        try {
            await window.__TAURI__.invoke('plugin:log|' + type, { message: '[注入脚本] ' + message });
        } catch(e) {
            console.error('日志发送失败:', e);
        }
    };

    // 通知脚本已加载
    window.__pakeLog('注入脚本开始执行');
    
    // 清除登录状态
window.__pakeLog('正在清除登录状态...');
try {
    // 清除 token
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('REFRESH_TOKEN');
    
    // 清除登录表单缓存（包含加密的用户名密码等）
    localStorage.removeItem('LoginForm');
    
    // 清除租户信息
    localStorage.removeItem('TenantId');
    
    // 清除其他可能的登录状态
    sessionStorage.clear();
    
    window.__pakeLog('登录状态已清除');
} catch(e) {
    window.__pakeLog('清除登录状态失败: ' + e.message, 'error');
}
    
    // inject-app-info.js
// 注入应用信息
window.addEventListener('DOMContentLoaded', () => {
    const APP_NAME = '"zserp"';
    const APP_VERSION = '"1.0.1"';
    
    const appInfo = {
        name: APP_NAME,
        version: APP_VERSION,
        isPakeApp: true
    };
    window.PAKEPLUS_APP = appInfo;
    
    // 创建通知元素
    const notificationDiv = document.createElement('div');
    notificationDiv.style.cssText = `
        position: fixed;
        top: 16px;
        right: 16px;
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
    
    notificationDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 4px;">
            ${appInfo.name}
        </div>
        <div style="font-size: 12px; opacity: 0.9;">
            版本 ${appInfo.version}
        </div>
    `;
    
    document.body.appendChild(notificationDiv);
    
    // 5秒后自动隐藏
    setTimeout(() => {
        notificationDiv.style.opacity = '0';
    }, 5000);
    
    // 点击显示/隐藏
    notificationDiv.addEventListener('click', () => {
        notificationDiv.style.opacity = notificationDiv.style.opacity === '0' ? '1' : '0';
    });
    
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
    
    console.log('PakePlus App Info:', appInfo);
}); 
// end inject-app-info.js
;
    
    window.__pakeLog('基础脚本执行完成');
    
window.__pakeLog('注入脚本执行完成');