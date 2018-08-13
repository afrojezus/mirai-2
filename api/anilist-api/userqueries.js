export const userQuery = `
  query {
    User {
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
