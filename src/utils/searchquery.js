export default `query(
  $id: Int
  $page: Int
  $season: MediaSeason
  $seasonYear: Int
  $search: String
  $status: MediaStatus
  $isAdult: Boolean
  $sort: [MediaSort]
) {
  Page(page: $page) {
    media(
      id: $id
      search: $search
      season: $season
      seasonYear: $seasonYear
      sort: $sort
      status: $status
      isAdult: $isAdult
    ) {
      id
      title {
        english
        romaji
        native
      }
      coverImage {
        large
        medium
      }
      type
      format
      description(asHtml: true)
    }
  }
}
`;

export const searchCharQuery = `query(
  $id: Int
  $page: Int
    $search: String
) {
  Page(page: $page) {
    characters (id: $id, search: $search) {
      id
        name {
            first
            last
            native
            alternative
        }
        image {
            large
            medium
        }
        description(asHtml: true)
        media {
            edges {
                node {
                    id
                    title {
                        english
                        romaji
                        native
                    }
                    coverImage {
                        large
                        medium
                    }
                    description(asHtml: true)
                    type
                }
                id
                relationType
                characterRole
            }
        }
    }
  }
}
`;

export const searchStaffQuery = `query(
  $id: Int
  $page: Int
    $search: String
) {
  Page(page: $page) {
    staff (id: $id, search: $search) {
      id
        name {
            first
            last
            native
        }
        image {
            large
            medium
        }
        language
        description(asHtml: true)
    }
  }
}
`;

export const searchStudiosQuery = `query(
  $id: Int
  $page: Int
    $search: String
) {
  Page(page: $page) {
    studios (id: $id, search: $search) {
        id
        name
    }
  }
}
`;
