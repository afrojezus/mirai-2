{!isEmpty(user) && user.episodeProgress ? (
                  <div style={{ width: "100%" }}>
                    <Grid
                      item
                      xs
                      className={classes.itemContainer}
                      style={{
                        flexDirection: "row",
                        display: "flex"
                      }}
                    >
                      <SectionTitle title={lang.home.animehistoryTitle} />
                      <div style={{ flex: 1 }} />
                      <Typography variant="title" className={classes.headline}>
                        {Object.values(user.episodeProgress).length}{" "}
                        {lang.home.animehistoryEstimate}
                      </Typography>
                      <IconButton
                        onClick={() => this.props.history.push("/history")}
                      >
                        <ICON.History />
                      </IconButton>
                    </Grid>
                    <Container spacing={16}>
                      {user.episodeProgress ? (
                        <SuperTable
                          data={Object.values(user.episodeProgress)
                            .filter(s => s.recentlyWatched)
                            .sort(
                              (a, b) => b.recentlyWatched - a.recentlyWatched
                            )}
                          limit={24}
                          type="s"
                          typeof="progress"
                        />
                      ) : (
                        <SuperTable loading />
                      )}
                    </Container>
                  </div>
                ) : null}
                <div style={{ width: "100%" }}>
                  <Grid
                    item
                    xs
                    className={classes.itemContainer}
                    style={{
                      flexDirection: "row",
                      display: "flex"
                    }}
                  >
                    <SectionTitle title={lang.home.collections} />
                    <div style={{ flex: 1 }} />
                  </Grid>
                  <Container spacing={16}>
                    {rankingMentionable ? (
                      <SuperTable
                        data={Object.values(rankingMentionable)}
                        type="c"
                        typeof="ranking"
                        limit={12}
                      />
                    ) : (
                      <SuperTable loading />
                    )}
                  </Container>
                </div>
                <div style={{ width: "100%" }}>
                  <Grid
                    item
                    xs
                    className={classes.itemContainer}
                    style={{
                      flexDirection: "row",
                      display: "flex"
                    }}
                  >
                    <SectionTitle title={lang.home.ongoingAnimeTitle} />
                    <div style={{ flex: 1 }} />
                    <Typography variant="title" className={classes.headline}>
                      {this.props.mir &&
                      this.props.mir.twist &&
                      this.props.mir.twist.length > 0
                        ? `${Object.values(this.props.mir.twist).filter(
                            s => s.ongoing === true
                          ).length - 1} ${lang.home.ongoingAnimeEstimate}`
                        : null}
                    </Typography>
                  </Grid>
                  <Container spacing={16}>
                    {ongoing &&
                    ongoing.data &&
                    this.props.mir &&
                    this.props.mir.twist &&
                    this.props.mir.twist.length > 0 ? (
                      <SuperTable
                        data={Filter(
                          ongoing.data.Page.media,
                          this.props.mir.twist
                        )
                          .filter(s => s.nextAiringEpisode)
                          .sort(
                            (a, b) =>
                              a.nextAiringEpisode.timeUntilAiring -
                              b.nextAiringEpisode.timeUntilAiring
                          )}
                        type="s"
                        typeof="ongoing"
                        limit={12}
                      />
                    ) : (
                      <SuperTable loading />
                    )}
                  </Container>
                </div>
                <div style={{ width: "100%" }}>
                  <Grid item xs className={classes.itemContainer}>
                    <SectionTitle title={lang.home.ongoingMangaTitle} />
                  </Grid>
                  <Container spacing={16}>
                    {ongoingM && ongoingM.data ? (
                      <SuperTable
                        data={ongoingM.data.Page.media}
                        type="m"
                        typeof="ongoing"
                        limit={12}
                      />
                    ) : (
                      <SuperTable loading />
                    )}
                  </Container>
                </div>