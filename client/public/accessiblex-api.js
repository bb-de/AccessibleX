
(function () {
  if (window.AccessibleX) return;

  window.AccessibleX = {
    iframe: null,

    send(type, value = null) {
      if (this.iframe?.contentWindow) {
        this.iframe.contentWindow.postMessage({ type, value }, "*");
      }
    },

    setContrast(on = true) {
      this.send(on ? "set-contrast" : "reset");
    },

    increaseFont() {
      this.send("increase-font");
    },

    reset() {
      this.send("reset");
    },

    open() {
      this.iframe?.classList.add("visible");
    },

    close() {
      this.iframe?.classList.remove("visible");
    },

    init(iframeId = "accessiblex-iframe") {
      this.iframe = document.getElementById(iframeId);
      window.addEventListener("message", (e) => {
        if (e.data?.type === "AccessibleX:Status") {
          console.log("Widget-Status:", e.data.status);
        }
      });
    }
  };
})();
