const { app, BrowserWindow, ipcMain, nativeTheme, Menu, Tray } = require('electron');
const path=require('node:path');
const { version } = require('react');
const {nativeImage}=require('electron/common');
const { trace } = require('node:console');
const createWindow=()=>{
    const win=new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            preload: path.join(__dirname,'preload.js')
        }
    })
    win.loadFile('index.html');
}

ipcMain.handle('dark-mode:toggle',()=>{
    if(nativeTheme.shouldUseDarkColors){
        nativeTheme.themeSource='light'
    }else{
        nativeTheme.themeSource='dark'
    }
    return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system',()=>{
    nativeTheme.themeSource='system'
})

app.whenReady().then(()=>{
    createWindow();
    const red = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACTSURBVHgBpZKBCYAgEEV/TeAIjuIIbdQIuUGt0CS1gW1iZ2jIVaTnhw+Cvs8/OYDJA4Y8kR3ZR2/kmazxJbpUEfQ/Dm/UG7wVwHkjlQdMFfDdJMFaACebnjJGyDWgcnZu1/lrCrl6NCoEHJBrDwEr5NrT6ko/UV8xdLAC2N49mlc5CylpYh8wCwqrvbBGLoKGvz8Bfq0QPWEUo/EAAAAASUVORK5CYII=')
    const green = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACOSURBVHgBpZLRDYAgEEOrEzgCozCCGzkCbKArOIlugJvgoRAUNcLRpvGH19TkgFQWkqIohhK8UEaKwKcsOg/+WR1vX+AlA74u6q4FqgCOSzwsGHCwbKliAF89Cv89tWmOT4VaVMoVbOBrdQUz+FrD6XItzh4LzYB1HFJ9yrEkZ4l+wvcid9pTssh4UKbPd+4vED2Nd54iAAAAAElFTkSuQmCC')
    tray = new Tray(red)
    tray.setToolTip('Tray Icon Demo')
    
    const contextMenu = Menu.buildFromTemplate([
        {
            label:'Open App',
            click: ()=>{
                const wins = BrowserWindow.getAllWindows()
                if(wins.length===0) {
                    createWindow()
                } else{
                    wins[0].focus()
                }
            }
        },
        {
            label: 'Set Green Icon' ,
            type: 'checkbox',
            click:({checked})=>{
                checked? tray.setImage(green) : tray.setImage(red)
            }
        },
        {
            label:'Set Title',
            type: 'checkbox',
            click:({checked})=>{
                checked? tray.setTitle('Title') : tray.setTitle('')
            }
        },
        {role:'quit'}
    ])
    
    tray.setContextMenu(contextMenu)

    app.on('activate',()=>{
        if(BrowserWindow.getAllWindows().length===0) createWindow();
    })
})
app.on('window-all-closed',()=>{
    if(process.platform!=='darwin') app.quit();
})
