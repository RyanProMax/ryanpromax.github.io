import Image from './Image';
import Link from './Link';

const DEFAULT_LABELS = { learnMore: 'Learn more' };

interface CardProps {
  title: string;
  description: string;
  imgSrc?: string;
  href?: string;
  labels?: typeof DEFAULT_LABELS;
}

export default function Card({
  title,
  description,
  imgSrc,
  href,
  labels = DEFAULT_LABELS,
}: CardProps) {
  return (
    <article className="project-card">
      {imgSrc && (
        <div className="project-image">
          {href ? (
            <Link href={href} aria-label={title}>
              <Image alt={title} src={imgSrc} width={640} height={360} />
            </Link>
          ) : (
            <Image alt={title} src={imgSrc} width={640} height={360} />
          )}
        </div>
      )}
      <div className="project-copy">
        <h2>
          {href ? (
            <Link href={href}>
              {title} <span aria-hidden="true">↗</span>
            </Link>
          ) : (
            title
          )}
        </h2>
        <p>{description}</p>
        {href && (
          <Link href={href} className="project-link">
            {labels.learnMore} →
          </Link>
        )}
      </div>
    </article>
  );
}
