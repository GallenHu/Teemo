export default class FileUtils {
  static writeFile(cnt: string, fileName: string): void {
    const data = new Blob([cnt], { type: 'text/plain' });

    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);

    document.body.appendChild(link);
    link.click();
  }

  static readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
}
