/**
 * @description 生成UUID字符串
 */
export function uuid() {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now();
    }
    const UuidStr = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // tslint:disable-next-line: no-bitwise
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        // tslint:disable-next-line: no-bitwise
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return UuidStr;
}
