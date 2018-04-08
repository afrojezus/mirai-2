export const userQuery = `
  query {
    Viewer {
        id
        name
        about(asHtml: true)
        avatar {
            large
            medium
        }
        bannerImage
        isFollowing
        favorites {
            anime {
                edges {
                    node {
                        id
                        title {
                            romaji
                        }
                        type
                        format
                        
                    }
                }
            }
        }
    }
  }
`;

export default {};
