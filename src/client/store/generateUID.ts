export const generateUID  = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 9);
    const performanceMark = performance.now().toString(36).replace('.', '');

    return `${timestamp}-${randomPart}-${performanceMark}`;
}
