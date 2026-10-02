export default function secondsToMinutes(seconds) {
    const minutes = Math.floor((Number(seconds) % 3600) / 60);
    const secs = Math.floor(Number(seconds) % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(secs).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}