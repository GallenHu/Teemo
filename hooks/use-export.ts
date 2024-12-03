export function useExport() {
  const exportData = () => {
    return fetch("/api/data/export", {
      method: "POST",
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      let fileName = response.headers.get("Content-Disposition");
      fileName = fileName?.split("filename=")[1] || "export.json";
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    });
  };

  return { exportData };
}
