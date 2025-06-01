function dateFormatter(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function dateTimeFormatter(dateString: string): string {
    const date = new Date(dateString);
    return (
        date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) +
        ' ' +
        date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        })
    );
}

export { dateFormatter, dateTimeFormatter };
