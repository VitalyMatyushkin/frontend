function formatSizedImageScr(src, width, height) {
    return `${src}/contain?height=${height}&width=${width}`;
}

const ImageHelper = {
    formatSizedImageScr: formatSizedImageScr
};

module.exports = ImageHelper;