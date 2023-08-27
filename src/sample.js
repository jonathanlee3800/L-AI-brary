// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener(returnMessage);
function returnMessage(info, tab) {
    // console.log(chrome.action.openPopup());
    // chrome.storage.sync.set({"selectionText": info.selectionText});
    // console.log("set!");
        // if (info.selectionText) {
    //     chrome.tabs.sendMessage(tab.id, { greeting: info.selectionText });
    //     console.log("info.selectionText:",info.selectionText);
    // }
    // chrome.scripting.executeScript({
    //     target: { tabId: info.selectionText.newValue },
    //     function: searchWithFacets,
    //     args: [refineTextObj, info.selectionText.newValue, mainPromptFn],
    //   });
    chrome.tabs.create({ url: "src/index.html", active:true}, ()=>{    
    setTimeout(function(){
        chrome.storage.sync.set({"selectionText": info.selectionText});
        console.log("set!");
    }
    , 1000);
});
};
// A generic onclick callback function.
// function genericOnClick(info) {
// console.log("info:",info.selectionText);
// returnMessage();

// };

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "SMUSEARCH",
    title: 'Generate Insights with\'"%s"',
    contexts: ["selection"],
  });
  chrome.storage.local.set({ chatHistory: [] });
});
