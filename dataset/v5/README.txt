jokes.csv format:
[joke.id, joke.joke_text]

ratings.csv format:
[user.id, rating.joke.id, rating.rating, rating.rating_type]

rating_type = {
    1: 'Gauge',
    2: 'Random',
    3: 'Recommended'
}
