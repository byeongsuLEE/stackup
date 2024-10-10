interface ScoreProps {
  totalScore: number;
}

const Score = ({ totalScore }: ScoreProps) => {
  // 소수점 반올림
  const roundedScore = Math.round(totalScore);

  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <input
          key={star}
          type="radio"
          name="rating-4"
          className="mask mask-star-2 bg-yellow-200"
          disabled
          style={{ cursor: 'default' }}
          checked={roundedScore >= star}
          readOnly
        />
      ))}
    </div>
  )
}

export default Score;