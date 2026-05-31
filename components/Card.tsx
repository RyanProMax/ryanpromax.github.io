import Image from './Image';
import Link from './Link';

const DEFAULT_LABELS = {
  role: 'Role',
  focus: 'Focus',
  impact: 'Impact',
};

const Card = ({
  title,
  description,
  role,
  focus,
  impact,
  imgSrc,
  href,
  labels = DEFAULT_LABELS,
}) => (
  <div className="md max-w-[544px] p-4 md:w-1/2">
    <div
      className={`${
        imgSrc && 'h-full'
      } hover:border-primary-500 dark:hover:border-primary-400 overflow-hidden rounded-md border-2 border-gray-200/60 transition-all duration-300 dark:border-gray-700/60`}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-48"
            width={544}
            height={306}
          />
        ))}
      <div className="p-6">
        <h2 className="mb-3 text-2xl leading-8 font-bold tracking-tight">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="prose mb-4 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
        {(role || focus || impact) && (
          <dl className="mb-4 space-y-2 text-sm leading-6">
            {role && (
              <div>
                <dt className="inline font-semibold text-gray-900 dark:text-gray-100">
                  {labels.role}:{' '}
                </dt>
                <dd className="inline text-gray-600 dark:text-gray-300">{role}</dd>
              </div>
            )}
            {focus && (
              <div>
                <dt className="inline font-semibold text-gray-900 dark:text-gray-100">
                  {labels.focus}:{' '}
                </dt>
                <dd className="inline text-gray-600 dark:text-gray-300">{focus}</dd>
              </div>
            )}
            {impact && (
              <div>
                <dt className="inline font-semibold text-gray-900 dark:text-gray-100">
                  {labels.impact}:{' '}
                </dt>
                <dd className="inline text-gray-600 dark:text-gray-300">{impact}</dd>
              </div>
            )}
          </dl>
        )}
        {href && (
          <Link
            href={href}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-base leading-6 font-medium"
            aria-label={`Link to ${title}`}
          >
            Learn more &rarr;
          </Link>
        )}
      </div>
    </div>
  </div>
);

export default Card;
