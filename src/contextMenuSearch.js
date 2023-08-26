var contextMenuItem = {
    "id": "SMUSEARCH",
    "title": "SMUSEARCH",
    "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem);
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "hello",
      title: "test",
      contexts: ["selection"]
    });
  });