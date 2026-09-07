import Image from "next/image"
import AuthBannerImage from "@/public/images/banner.jpg"

const AuthBanner = () => {
  return (
    <div className="relative font-amiri font-normal text-2xl w-full h-full rounded-2xl overflow-hidden">
      <Image
        src={AuthBannerImage}
        alt="Banner"
        priority
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-8 left-8 text-white z-10">
        <h1 className="text-6xl font-playfair mb-2">Simpus</h1>
        <h1 className="text-xl font-poppins font-normal">Sistem Informasi Puskesmas</h1>
      </div>
    </div>
  )
}

export default AuthBanner