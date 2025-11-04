const Router: React.FC = () => {
  return (
    <div className="size-full flex flex-col items-center justify-center gap-10">
      <img src="/images/main/logo.png" alt="logo" className="w-32 block hover:animate-turbo" />
      <div className="flex items-center justify-center gap-10">
        {/* {pipe(
              LINKS,
              zipWithIndex,
              map(([index, link]) => (
                <Link
                  key={index}
                  href={`${link.href(allowAgents)}`}
                  url={link.url}
                  delay={index * 0.2}
                >
                  {link.title}
                </Link>
              )),
              toArray
            )} */}
      </div>
    </div>
  )
}

export default Router
