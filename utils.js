export async function getVideoTitle(url) {
  const videoId = url.split("v=")[1];
  const ampersandPosition = videoId.indexOf("&");
  if (ampersandPosition !== -1) {
    videoId = videoId.substring(0, ampersandPosition);
  }
  return fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  )
    .then(response => response.json())
    .then(({ title }) => {
      const withoutSpacesTitle = title.replace(/\s/g, "_");
      const safeTitle = withoutSpacesTitle.replace(/[^a-zA-Z0-9_]/g, "");
      return safeTitle;
    });
}
